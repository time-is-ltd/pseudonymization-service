require('dotenv').config()
import * as fs from 'fs'
import * as express from 'express'
import * as http from 'http'
import * as https from 'https'

import config from './config'
import extractToken from './helpers/extract-token'
import googleapis from './modules/googleapis/googleapis.module'
import microsoftgraph from './modules/microsoftgraph/microsoftgraph.module'
import { Route } from './router/interfaces/router.interface'

// @TODO: remove
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

// Register modules
type Module = {
  enabled: boolean,
  routes: Route[]
}

const microsoftgraphModule = microsoftgraph()
const googleapisModule = googleapis()
const modules: Module[] = [
  microsoftgraphModule,
  googleapisModule
]

const authMiddleware: (requireAuth: boolean) => express.RequestHandler = (requireAuth: boolean) => (req, res, next) => {
  if (!requireAuth) {
    return next()
  }

  const authorization = req.headers.authorization
  if (authorization) {
    // Check proxy key
    const apiToken = extractToken(authorization)
    if (config.apiToken === apiToken) {
      return next()
    }
  }

  res.sendStatus(403)
}

const bootstrap = () => {
  const app = express()

  // app.use(bodyParser())

  // Register routes
  modules.forEach(({ enabled, routes }) => {
    if (!enabled) {
      return
    }

    routes.forEach((route) => {
      route.hosts.forEach(host => {
        const path = `/${host}${route.path}`
        const method = route.method || 'get'
        const requireAuth = route.requireAuth !== false

        console.info(`Registering route [${method.toUpperCase()}] ${path}`)

        const handlers = []
        if (Array.isArray(route.handler)) {
          handlers.push(...route.handler)
        } else {
          handlers.push(route.handler)
        }
        app[method](
          path,
          authMiddleware(requireAuth),
          ...handlers
        )
      })
    })
  })

  if (config.httpPort > 0) {
    const httpServer = http.createServer(app)
    httpServer.listen(config.httpPort)
  }

  if (config.httpsPort > 0) {
    const key = fs.readFileSync(config.sslKey)
    const cert = fs.readFileSync(config.sslCert)
    const httpsServer = https.createServer({ key, cert }, app)
    httpsServer.listen(config.httpsPort)
  }
}

bootstrap()
