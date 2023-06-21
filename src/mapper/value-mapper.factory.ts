import { config, contentType, email, extractDomains, filename, hashed, id, proxify, url } from '../anonymizer'
import { TYPES } from './constants'
import { boolean, number, string } from './transformers'

export const valueMapperFactory = async () => {
  const [
    anonymizeInternalEmailUsername,
    anonymizeExternalEmailUsername,
    anonymizeInternalEmailDomain,
    anonymizeExternalEmailDomain,
    internalDomainList,
    enableInternalEmailPlusAddressing,
    enableExternalEmailPlusAddressing,
    isExtractDomains,
    extractDomainsWhitelist
  ] = await Promise.all([
    config.anonymizeInternalEmailUsername,
    config.anonymizeExternalEmailUsername,
    config.anonymizeInternalEmailDomain,
    config.anonymizeExternalEmailDomain,
    config.internalDomainList,
    config.enableInternalEmailPlusAddressing,
    config.enableExternalEmailPlusAddressing,
    config.extractDomains,
    config.extractDomainsWhitelist
  ])
  const [
    anonymizationSalt,
    rsaPublicKey,
    baseUrl
  ] = await Promise.all([
    config.anonymizationSalt,
    config.rsaPublicKey,
    config.baseUrl
  ])

  return (type: symbol, value: unknown) => {
    if (type === TYPES.Private) {
      return undefined
    }
    if (type === TYPES.Hashed) {
      return hashed(string(value), anonymizationSalt)
    }
    if (type === TYPES.Passthrough) {
      return value
    }
    if (type === TYPES.Array) {
      return Array.isArray(value) ? value : []
    }
    if (type === TYPES.ContentType) {
      return contentType(string(value))
    }
    if (type === TYPES.ExtractedDomains) {
      return extractDomains(string(value), isExtractDomains, extractDomainsWhitelist)
    }
    if (type === TYPES.Text || type === TYPES.String || type === TYPES.Datetime || type === TYPES.ETag || type === TYPES.Username) {
      return string(value)
    }
    if (type === TYPES.Number) {
      return number(value)
    }
    if (type === TYPES.Boolean) {
      return boolean(value)
    }
    if (type === TYPES.Url) {
      return url(string(value), rsaPublicKey)
    }
    if (type === TYPES.Proxify) {
      return proxify(string(value), baseUrl)
    }
    if (type === TYPES.Id) {
      return id(
        string(value),
        {
          rsaPublicKey,
          anonymizationSalt
        }
      )
    }
    if (type === TYPES.Email) {
      return email(
        string(value),
        {
          anonymizeInternalEmailUsername,
          anonymizeExternalEmailUsername,
          anonymizeInternalEmailDomain,
          anonymizeExternalEmailDomain,
          internalDomainList,
          anonymizationSalt,
          enableExternalEmailPlusAddressing,
          enableInternalEmailPlusAddressing
        }
      )
    }
    if (type === TYPES.EmailOrHashed) {
      let result = email(
        string(value),
        {
          anonymizeInternalEmailUsername,
          anonymizeExternalEmailUsername,
          anonymizeInternalEmailDomain,
          anonymizeExternalEmailDomain,
          internalDomainList,
          anonymizationSalt,
          enableExternalEmailPlusAddressing,
          enableInternalEmailPlusAddressing
        }
      )
      if (!result) {
        // if no email found, hash the content
        result = hashed(string(value), anonymizationSalt)
      }
      return result
    }
    if (type === TYPES.Filename) {
      return filename(string(value))
    }

    return undefined
  }
}
