import { configFactory, toArray, toBoolean, toPem, toString } from '../config'

const anonymizerConfig = {
  baseUrl: toString(),
  internalDomainList: toArray(),
  anonymizeExternalEmailDomain: toBoolean(true),
  anonymizeExternalEmailUsername: toBoolean(true),
  anonymizeInternalEmailDomain: toBoolean(false),
  anonymizeInternalEmailUsername: toBoolean(true),
  enableInternalEmailPlusAddressing: toBoolean(true),
  enableExternalEmailPlusAddressing: toBoolean(false),
  anonymizationSalt: toString(),
  rsaPrivateKey: toPem(),
  rsaPublicKey: toPem()
}

export const config = configFactory(anonymizerConfig, [
  'anonymizationSalt',
  'rsaPrivateKey',
  'rsaPublicKey'
])

export default config
