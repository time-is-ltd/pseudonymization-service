import {configFactory, toBoolean, toNumber, toPem, toString} from './config'

const appConfig = {
  apiToken: toString(),
  sslKey: toPem(),
  sslCert: toPem(),
  httpPort: toNumber(),
  httpsPort: toNumber(),
  verbosity: toNumber(0),
}

const config = configFactory(appConfig, [
  'apiToken',
  'sslKey',
  'sslCert'
])

export default config
