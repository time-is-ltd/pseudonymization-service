import { config, email, filename, id, url, proxify, hashed } from '../anonymizer'
import { TYPES } from './constants'
import { string, boolean, number } from './transformers'

export const valueMapperFactory = async () => {
  const [
    anonymizeInternalEmailUsername,
    anonymizeExternalEmailUsername,
    anonymizeInternalEmailDomain,
    anonymizeExternalEmailDomain,
    internalDomainList,
    anonymizationSalt,
    rsaPublicKey,
    baseUrl,
    enableInternalEmailPlusAddressing,
    enableExternalEmailPlusAddressing
  ] = await Promise.all([
    config.anonymizeInternalEmailUsername,
    config.anonymizeExternalEmailUsername,
    config.anonymizeInternalEmailDomain,
    config.anonymizeExternalEmailDomain,
    config.internalDomainList,
    config.anonymizationSalt,
    config.rsaPublicKey,
    config.baseUrl,
    config.enableInternalEmailPlusAddressing,
    config.enableExternalEmailPlusAddressing
  ])

  return (type: Symbol, value: unknown) => {
    switch (type) {
      case TYPES.Private:
        return undefined
      case TYPES.Hashed:
        return hashed(string(value), anonymizationSalt)
      case TYPES.Passthrough:
        return value
      case TYPES.Array:
        return Array.isArray(value) ? value : []
      case TYPES.Text:
      case TYPES.String:
      case TYPES.Datetime:
      case TYPES.ContentType:
      case TYPES.ETag:
      case TYPES.Username:
        return string(value)
      case TYPES.Number:
        return number(value)
      case TYPES.Boolean:
        return boolean(value)
      case TYPES.Url:
        return url(string(value), rsaPublicKey)
      case TYPES.Proxify:
        return proxify(string(value), baseUrl)
      case TYPES.Id:
        const idConfig = {
          rsaPublicKey,
          anonymizationSalt
        }

        return id(string(value), idConfig)
      case TYPES.Email:
        const emailConfig = {
          anonymizeInternalEmailUsername,
          anonymizeExternalEmailUsername,
          anonymizeInternalEmailDomain,
          anonymizeExternalEmailDomain,
          internalDomainList,
          anonymizationSalt,
          enableExternalEmailPlusAddressing,
          enableInternalEmailPlusAddressing
        }

        return email(string(value), emailConfig)
      case TYPES.Filename:
        return filename(string(value))
    }

    return undefined
  }
}
