import * as express from 'express'
import * as compression from 'compression'
import * as helmet from 'helmet'

import config from './app.config'
import extractToken from './helpers/extract-token'
import googleapis from './modules/googleapis/googleapis.module'
import microsoftgraph from './modules/microsoftgraph/microsoftgraph.module'
import office365 from './modules/office365/office365.module'
import { type Route } from './router/interfaces/router.interface'

// Register modules
interface Module {
  enabled: boolean
  routes: Route[]
}

const authMiddleware: (requireAuth: boolean) => express.RequestHandler = (requireAuth: boolean) => async (req, res, next) => {
  if (!requireAuth) {
    next()
    return
  }

  const authorization = req.headers.authorization
  if (authorization != null) {
    // Check proxy key
    const apiTokenInAuthorizationHeader = extractToken(authorization)
    const apiToken = await config.apiToken

    // Do not allow short apiToken
    const isTokenValid = apiToken?.length >= 32
    if (isTokenValid && apiToken === apiTokenInAuthorizationHeader) {
      next()
      return
    }
  }

  res.sendStatus(403)
}

export const bootstrap = async (): Promise<express.Express> => {
  const microsoftgraphModule = await microsoftgraph()
  const googleapisModule = await googleapis()
  const office365Module = await office365()
  const modules: Module[] = [
    microsoftgraphModule,
    googleapisModule,
    office365Module
  ]

  const app = express()
  app.use(compression())
  app.use(helmet())

  // Health check
  app.get('/healthcheck', (_, res) => res.sendStatus(200))
  app.get('/hc', (_, res) => res.sendStatus(200))

  // Diagnostics
  app.get('/diag', authMiddleware(true), (_, res) => {
    const routes: any[] = []
    app._router.stack.forEach((route: any) => {
      if (route.route?.path) {
        routes.push(route.route.path)
      }
    })

    res.json({
      version: process.env.npm_package_version,
      routes
    })
  })

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
          const requireAuth = route.requireAuth ?? true

          console.info(`Registering ${requireAuth ? 'protected' : 'public'} route [${method.toUpperCase()}] ${path}`)

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

  return app
}
