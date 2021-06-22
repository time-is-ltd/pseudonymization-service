import * as express from 'express'
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as http from 'http'
import * as https from 'https'

import config from './app.config'
import extractToken from './helpers/extract-token'
import googleapis from './modules/googleapis/googleapis.module'
import microsoftgraph from './modules/microsoftgraph/microsoftgraph.module'
import { Route } from './router/interfaces/router.interface'

// Register modules
interface Module {
  enabled: boolean
  routes: Route[]
}

const authMiddleware: (requireAuth: boolean) => express.RequestHandler = (requireAuth: boolean) => async (req, res, next) => {
  if (!requireAuth) {
    return next()
  }

  const authorization = req.headers.authorization
  if (authorization) {
    // Check proxy key
    const apiTokenInAuthorizationHeader = extractToken(authorization)
    const apiToken = await config.apiToken

    // Do not allow short apiToken
    const isTokenValid = apiToken?.length >= 32
    if (isTokenValid && apiToken === apiTokenInAuthorizationHeader) {
      return next()
    }
  }

  res.sendStatus(403)
}

const withKeepAliveTimeout = (server: http.Server, keepAliveTimeout = 620 * 1000, headersTimeout = 650 * 1000) => {
  server.keepAliveTimeout = keepAliveTimeout
  // must be bigger than keepAliveTimeout
  // needed for nodejs > 10.15.2
  // https://shuheikagawa.com/blog/2019/04/25/keep-alive-timeout/
  server.headersTimeout = headersTimeout
}

const bootstrap = async () => {
  const microsoftgraphModule = await microsoftgraph()
  const googleapisModule = await googleapis()
  const modules: Module[] = [
    microsoftgraphModule,
    googleapisModule
  ]

  const app = express()
  app.use(compression())
  app.use(helmet())

  const httpPort = await config.httpPort
  const httpsPort = await config.httpsPort
  const sslKey = await config.sslKey
  const sslCert = await config.sslCert

  // Health check
  app.get('/healthcheck', (_, res) => res.sendStatus(200))

  // Register routes
  modules.forEach(({ enabled, routes }) => {
    if (!enabled) {
      return
    }

    routes.forEach((route) => {
      route.hosts.forEach(host => {
        const paths = Array.isArray(route.path)
          ? route.path
          : [route.path]
        paths.forEach(routePath => {
          const path = `/${host}${routePath}`
          const method = route.method || 'get'
          const requireAuth = route.requireAuth

          console.info(`Registering route [${method.toUpperCase()}] ${path}`)

          const handlers = Array.isArray(route.handler)
            ? route.handler
            : [route.handler]
          app[method](
            path,
            authMiddleware(requireAuth),
            ...handlers
          )
        })
      })
    })
  })

  if (httpPort > 0) {
    const httpServer = http.createServer(app)
    withKeepAliveTimeout(httpServer)
    httpServer.listen(httpPort)
  }

  if (httpsPort > 0) {
    const httpsServer = https.createServer({
      key: sslKey,
      cert: sslCert
    }, app)
    withKeepAliveTimeout(httpsServer)
    httpsServer.listen(httpsPort)
  }
}

bootstrap()
