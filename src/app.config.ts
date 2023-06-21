import { configFactory, toNumber, toPem, toString } from './config'

const appConfig = {
  apiToken: toString(),
  sslKey: toPem(),
  sslCert: toPem(),
  httpPort: toNumber(),
  httpsPort: toNumber()
}

const config = configFactory(appConfig, [
  'apiToken',
  'sslKey',
  'sslCert'
])

export default config
