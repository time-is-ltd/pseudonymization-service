// Comma separeted list of domains
const internalDomainList = (process.env.INTERNAL_DOMAIN_LIST || '').split(',')
const anonymizeExternalEmailDomain = (process.env.ANONYMIZE_EXTRENAL_EMAIL_DOMAIN || 'true') === 'true'
const anonymizeExternalEmailUsername = (process.env.ANONYMIZE_EXTRENAL_EMAIL_USERNAME || 'true') === 'true'
const anonymizeInternalEmailDomain = (process.env.ANONYMIZE_INTERNAL_EMAIL_DOMAIN || 'false') === 'true'
const anonymizeInternalEmailUsername = (process.env.ANONYMIZE_INTERNAL_EMAIL_USERNAME || 'true') === 'true'

const apiToken: string | undefined = process.env.API_TOKEN || ''
const anonymizationSalt: string | undefined = process.env.ANONYMIZATION_SALT
const httpPort: number = Number.parseInt(process.env.HTTP_PORT || '0')
const httpsPort: number = Number.parseInt(process.env.HTTPS_PORT || '0')
const sslKey: string = (process.env.SSL_KEY || '').replace(/\\n/gm, '\n')
const sslCert: string = (process.env.SSL_CERT || '').replace(/\\n/gm, '\n')

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
  httpPort,
  httpsPort
}