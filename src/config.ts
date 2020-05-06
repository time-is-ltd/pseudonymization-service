import { toArray, toBoolean, toNumber, toPem } from './helpers/config.helper'

export const internalDomainList = toArray(process.env.INTERNAL_DOMAIN_LIST)
export const anonymizeExternalEmailDomain = toBoolean(process.env.ANONYMIZE_EXTRENAL_EMAIL_DOMAIN, true)
export const anonymizeExternalEmailUsername = toBoolean(process.env.ANONYMIZE_EXTRENAL_EMAIL_USERNAME, true)
export const anonymizeInternalEmailDomain = toBoolean(process.env.ANONYMIZE_INTERNAL_EMAIL_DOMAIN, false)
export const anonymizeInternalEmailUsername = toBoolean(process.env.ANONYMIZE_INTERNAL_EMAIL_USERNAME, true)
export const anonymizeCalendarSummary = toBoolean(process.env.ANONYMIZE_CALENDAR_SUMMARY, true)
export const anonymizeCalendarDescription = toBoolean(process.env.ANONYMIZE_CALENDAR_DESCRIPTION, true)

export const apiToken: string | undefined = process.env.API_TOKEN
export const anonymizationSalt: string | undefined = process.env.ANONYMIZATION_SALT
export const httpPort: number = toNumber(process.env.HTTP_PORT)
export const httpsPort: number = toNumber(process.env.HTTPS_PORT)
export const sslKey: string = toPem(process.env.SSL_KEY)
export const sslCert: string = toPem(process.env.SSL_CERT)

export default {
  apiToken,
  internalDomainList,
  anonymizeExternalEmailDomain,
  anonymizeExternalEmailUsername,
  anonymizeInternalEmailDomain,
  anonymizeInternalEmailUsername,
  anonymizeCalendarSummary,
  anonymizeCalendarDescription,
  anonymizationSalt,
  sslKey,
  sslCert,
  httpPort,
  httpsPort
}