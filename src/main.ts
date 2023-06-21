import config from './app.config'
import * as http from 'http'
import * as https from 'https'
import { bootstrap } from './bootstrap'
import { runInitChecks } from './sanity'

const withKeepAliveTimeout = (server: http.Server, keepAliveTimeout = 620 * 1000, headersTimeout = 650 * 1000) => {
  server.keepAliveTimeout = keepAliveTimeout
  // must be bigger than keepAliveTimeout
  // needed for nodejs > 10.15.2
  // https://shuheikagawa.com/blog/2019/04/25/keep-alive-timeout/
  server.headersTimeout = headersTimeout
}

const stopOnSignal = (server: http.Server) => {
  const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT']
  signals.forEach(signal => {
    process.on(signal, () => {
      server.close()
    })
  })
}

export const run = async () => {
  const app = await bootstrap()

  const httpPort = await config.httpPort
  const httpsPort = await config.httpsPort
  const sslKey = await config.sslKey
  const sslCert = await config.sslCert

  if (httpPort > 0) {
    const httpServer = http.createServer(app)
    withKeepAliveTimeout(httpServer)
    httpServer.listen(httpPort)
    stopOnSignal(httpServer)
  }

  if (httpsPort > 0) {
    const httpsServer = https.createServer({
      key: sslKey,
      cert: sslCert
    }, app)
    withKeepAliveTimeout(httpsServer)
    httpsServer.listen(httpsPort)
    stopOnSignal(httpsServer)
  }

  await runInitChecks(app)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
