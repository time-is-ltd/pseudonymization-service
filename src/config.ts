import { toArray, toBoolean, toNumber, toPem } from './helpers/config.helper'

const internalDomainList = toArray(process.env.INTERNAL_DOMAIN_LIST)
const anonymizeExternalEmailDomain = toBoolean(process.env.ANONYMIZE_EXTRENAL_EMAIL_DOMAIN, true)
const anonymizeExternalEmailUsername = toBoolean(process.env.ANONYMIZE_EXTRENAL_EMAIL_USERNAME, true)
const anonymizeInternalEmailDomain = toBoolean(process.env.ANONYMIZE_INTERNAL_EMAIL_DOMAIN , false)
const anonymizeInternalEmailUsername = toBoolean(process.env.ANONYMIZE_INTERNAL_EMAIL_USERNAME , true)

const apiToken: string | undefined = process.env.API_TOKEN
const anonymizationSalt: string | undefined = process.env.ANONYMIZATION_SALT
const rsaPrivateKey: string = toPem(process.env.RSA_PRIVATE_KEY)

const httpPort: number = toNumber(process.env.HTTP_PORT)
const httpsPort: number = toNumber(process.env.HTTPS_PORT)
const sslKey: string = toPem(process.env.SSL_KEY)
const sslCert: string = toPem(process.env.SSL_CERT)


export default {
  apiToken,
  internalDomainList,
  anonymizeExternalEmailDomain,
  anonymizeExternalEmailUsername,
  anonymizeInternalEmailDomain,
  anonymizeInternalEmailUsername,
  anonymizationSalt,
  sslKey,
  sslCert,
  rsaPrivateKey,
  httpPort,
  httpsPort
}