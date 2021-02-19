import * as emailAddresses from 'email-addresses'
import sha512 from './sha512'

export type AnonymizeEmailConfig = {
  anonymizeInternalEmailUsername: boolean,
  anonymizeExternalEmailUsername: boolean,
  anonymizeInternalEmailDomain: boolean,
  anonymizeExternalEmailDomain: boolean,
  internalDomainList: string[],
  anonymizationSalt: string
}

const hash = (str: string, salt: string, length = 16) => {
  return sha512(salt, str).substr(0, length)
}

const anonymizeAddress = (username: string, domain: string, params: AnonymizeEmailConfig): string => {
  const {
    anonymizeInternalEmailUsername,
    anonymizeExternalEmailUsername,
    anonymizeInternalEmailDomain,
    anonymizeExternalEmailDomain,
    internalDomainList,
    anonymizationSalt
  } = params

  const isInternal = internalDomainList.indexOf(domain) > -1

  const anonymizeInternalUsername = isInternal
  && anonymizeInternalEmailUsername
  const anonymizeExternalUsername = !isInternal
  && anonymizeExternalEmailUsername
  const anonymizeUsername = anonymizeInternalUsername || anonymizeExternalUsername

  const anonymizeInternalDomain = isInternal
  && anonymizeInternalEmailDomain
  const anonymizeExternalDomain = !isInternal
  && anonymizeExternalEmailDomain
  const anonymizeDomain = anonymizeInternalDomain || anonymizeExternalDomain

  const finalUsername = anonymizeUsername
    ? hash(username, anonymizationSalt)
    : username

  const finalDomain = anonymizeDomain
    ? `${hash(domain, anonymizationSalt)}.hash`
    : domain

  return `${finalUsername}@${finalDomain}`
}

const normalizeValue = (value = '') => {
  return value.trim().toLocaleLowerCase()
}

export const email = (email: string, config: AnonymizeEmailConfig): string => {
  const addressList: any[] = emailAddresses.parseAddressList(email) || []

  return addressList
    .map(address => {
      const normalizedUsername = normalizeValue(address.local)
      const normalizedDomain = normalizeValue(address.domain)

      return anonymizeAddress(normalizedUsername, normalizedDomain, config)
    })
    .join(', ')
}

export const filename = (filename = ''): string => {
  const index = filename.lastIndexOf('.')
  const hasExtension = index > -1

  const length = hasExtension
    ? filename.substr(0, index).length
    : filename.length
  const extension = hasExtension
    ? filename.substr(index)
    : ''

  const anonymizedFilename = 'x'.repeat(length)

  return `${anonymizedFilename}${extension}`
}

export default {
  email,
  filename
}
