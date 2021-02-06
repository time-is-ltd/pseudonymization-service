import { toArray, toBoolean, toNumber, toPem } from './helpers/config.helper'

// Pseudonimization settings
const internalDomainList = toArray(process.env.INTERNAL_DOMAIN_LIST)
const anonymizeExternalEmailDomain = toBoolean(process.env.ANONYMIZE_EXTRENAL_EMAIL_DOMAIN, true)
const anonymizeExternalEmailUsername = toBoolean(process.env.ANONYMIZE_EXTRENAL_EMAIL_USERNAME, true)
const anonymizeInternalEmailDomain = toBoolean(process.env.ANONYMIZE_INTERNAL_EMAIL_DOMAIN , false)
const anonymizeInternalEmailUsername = toBoolean(process.env.ANONYMIZE_INTERNAL_EMAIL_USERNAME , true)

// Enable MS/Google API
const googleApiEnabled = toBoolean(process.env.GOOGLE_API_ENABLED)
const microsoftApiEnabled = toBoolean(process.env.MICROSOFT_API_ENABLED)

const apiToken: string | undefined = process.env.API_TOKEN
const anonymizationSalt: string | undefined = process.env.ANONYMIZATION_SALT
const rsaPrivateKey: string = toPem(process.env.RSA_PRIVATE_KEY)

// KV Name
const azureKeyVaultName: string | undefined = process.env.AZURE_KEY_VAULT_NAME
const gcpKeyVaultName: string | undefined = process.env.GCP_KEY_VAULT_NAME

// Service settings
const httpPort: number = toNumber(process.env.HTTP_PORT)
const httpsPort: number = toNumber(process.env.HTTPS_PORT)
const sslKey: string = toPem(process.env.SSL_KEY)
const sslCert: string = toPem(process.env.SSL_CERT)


export default {
  apiToken,
  anonymizationSalt,
  rsaPrivateKey,
  googleApiEnabled,
  microsoftApiEnabled,
  azureKeyVaultName,
  gcpKeyVaultName,
  internalDomainList,
  anonymizeExternalEmailDomain,
  anonymizeExternalEmailUsername,
  anonymizeInternalEmailDomain,
  anonymizeInternalEmailUsername,
  sslKey,
  sslCert,
  httpPort,
  httpsPort
}