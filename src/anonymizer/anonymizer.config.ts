import { configFactory, toArray, toBoolean, toPem, toString } from '../config'

const anonymizerConfig = {
  baseUrl: toString(),
  internalDomainList: toArray(),
  anonymizeExternalEmailDomain: toBoolean(true),
  anonymizeExternalEmailUsername: toBoolean(true),
  anonymizeInternalEmailDomain: toBoolean(false),
  anonymizeInternalEmailUsername: toBoolean(true),
  anonymizationSalt: toString(),
  rsaPrivateKey: toPem(),
  rsaPublicKey: toPem()
}

const config = configFactory(anonymizerConfig, [
  'anonymizationSalt',
  'rsaPrivateKey',
  'rsaPublicKey'
])

export default config
