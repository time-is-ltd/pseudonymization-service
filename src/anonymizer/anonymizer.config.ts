import { configFactory, toArray, toBoolean, toPem, toString } from '../config'

const anonymizerConfig = {
  baseUrl: toString(),
  internalDomainList: toArray(),
  anonymizeExternalEmailDomain: toBoolean(false),
  anonymizeExternalEmailUsername: toBoolean(false),
  anonymizeInternalEmailDomain: toBoolean(false),
  anonymizeInternalEmailUsername: toBoolean(false),
  enableInternalEmailPlusAddressing: toBoolean(true),
  enableExternalEmailPlusAddressing: toBoolean(false),
  extractDomains: toBoolean(true),
  extractDomainsWhitelist: toArray(),
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
