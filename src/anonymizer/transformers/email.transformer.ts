import * as emailAddresses from 'email-addresses'
import { cacheFactory } from '../../cache'
import { hash } from '../helpers'

export interface AnonymizeEmailConfig {
  anonymizeInternalEmailUsername: boolean
  anonymizeExternalEmailUsername: boolean
  anonymizeInternalEmailDomain: boolean
  anonymizeExternalEmailDomain: boolean
  internalDomainList: string[]
  anonymizationSalt: string
  enableInternalEmailPlusAddressing: boolean
  enableExternalEmailPlusAddressing: boolean
}

const normalizeValue = (value = '') => {
  return value.trim().toLocaleLowerCase()
}

const splitUsername = (str = '') => {
  const [username, ...tags] = str.split('+')

  const result = [username]
  if (tags.length > 0) {
    result.push(tags.join('+'))
  }
  return result
}

const anonymizeAddress = (username: string, domain: string, params: AnonymizeEmailConfig): string => {
  const {
    anonymizeInternalEmailUsername,
    anonymizeExternalEmailUsername,
    anonymizeInternalEmailDomain,
    anonymizeExternalEmailDomain,
    internalDomainList,
    anonymizationSalt,
    enableInternalEmailPlusAddressing,
    enableExternalEmailPlusAddressing
  } = params

  const isInternal = internalDomainList.includes(domain)

  const anonymizeInternalUsername = isInternal &&
  anonymizeInternalEmailUsername
  const anonymizeExternalUsername = !isInternal &&
  anonymizeExternalEmailUsername
  const anonymizeUsername = anonymizeInternalUsername || anonymizeExternalUsername

  const anonymizeInternalDomain = isInternal &&
  anonymizeInternalEmailDomain
  const anonymizeExternalDomain = !isInternal &&
  anonymizeExternalEmailDomain
  const anonymizeDomain = anonymizeInternalDomain || anonymizeExternalDomain

  const isInternalPlusAddressingEnabled = isInternal && enableInternalEmailPlusAddressing
  const isExternalPlusAddressingEnabled = !isInternal && enableExternalEmailPlusAddressing
  const isPlusAddressingEnabled = isInternalPlusAddressingEnabled || isExternalPlusAddressingEnabled

  const usernameParts = isPlusAddressingEnabled
    ? splitUsername(username)
    : [username]

  const finalUsername = usernameParts
    .map(normalizeValue)
    .map(part => {
      const normalizedPart = normalizeValue(part)
      return anonymizeUsername
        ? hash(normalizedPart, anonymizationSalt)
        : normalizedPart
    })
    .join('+')

  const normalizedDomain = normalizeValue(domain)
  const finalDomain = anonymizeDomain
    ? `${hash(normalizedDomain, anonymizationSalt)}.hash`
    : normalizedDomain

  return `${finalUsername}@${finalDomain}`
}

const cache = cacheFactory<string>()
export const email = (email: string, config: AnonymizeEmailConfig): string => {
  const normalizedEmail = normalizeValue(email)
  if (cache.has(normalizedEmail)) {
    return cache.get(normalizedEmail).v
  }

  const addressList: any[] = emailAddresses.parseAddressList(normalizedEmail) || []
  const anonymizedEmail = addressList
    .map(address => {
      return anonymizeAddress(address.local, address.domain, config)
    })
    .join(', ')

  cache.set(normalizedEmail, anonymizedEmail, 5 * 50) // keep in cache for 5 minutes

  return anonymizedEmail
}
