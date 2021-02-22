import * as emailAddresses from 'email-addresses'
import { cacheFactory } from '../cache'
import { sha512, rsa } from '../crypto'

export type AnonymizeEmailConfig = {
  anonymizeInternalEmailUsername: boolean,
  anonymizeExternalEmailUsername: boolean,
  anonymizeInternalEmailDomain: boolean,
  anonymizeExternalEmailDomain: boolean,
  internalDomainList: string[],
  anonymizationSalt: string
}

const RSA_PREFIX = '__rsa__'
const ID_PREFIX = '__id__'

const hash = (str: string, salt: string, length = 16) => {
  return sha512.createHash(salt, str).substr(0, length)
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

export interface AnonymizeIdConfig {
  rsaPublicKey: string
  anonymizationSalt: string
}

export const id = (value: string, config: AnonymizeIdConfig) => {
  const { rsaPublicKey, anonymizationSalt }  = config
  if (!rsaPublicKey) {
    return value
  }

  const addressList = emailAddresses.parseAddressList(value) || []
  const isEmail = addressList.length > 0
  if (isEmail) {
    const idPart: string[] = []

    // Add hashed id
    const hashedValue = hash(value, anonymizationSalt, 40)
    idPart.push(`${ID_PREFIX}${hashedValue}`)

    // Add encrypted value
    const encryptedValue = encryptUrlComponent(value, rsaPublicKey)
    idPart.push(encryptedValue)

    return idPart.join('')
  }

  return value
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

const cache = cacheFactory<string>()

const encodeRSA = (str = ''): string => {
  return str
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove ending '='
}

const decodeRSA = (str = ''): string => {
  const tail = Array(5 - str.length % 4).join('=') // Add removed at end '='
  const decodedStr = str
    .replace(/\-/g, '+') // Convert '-' to '+'
    .replace(/\_/g, '/') // Convert '_' to '/'

  return `${decodedStr}${tail}`
}

export const decryptUrl = (url: string, privateKey?: string): string => {
  if(!privateKey) {
    return url
  }

  const rsaContentRegExp = new RegExp(`\/((${RSA_PREFIX}|RSA_ENCRYPTED_EMAIL_)([^\/]+))`, 'gi')
  const valueRexExpMatchIterator = url.matchAll(rsaContentRegExp)
  const valueRexExpMatchArray = Array.from(valueRexExpMatchIterator)

  const shouldDecrypt = valueRexExpMatchArray?.length > 0

  if (!shouldDecrypt) {
    // no encrypted content found
    return url
  }

  let decryptedUrl = url
  for (const match of valueRexExpMatchArray) {
    const originalValue = match[1]
    let decryptedValue
    if (cache.has(originalValue)) {
      decryptedValue = cache.get(originalValue).v
    } else {
      const decodedValue = decodeRSA(match[3])
      decryptedValue = rsa.decrypt(decodedValue, privateKey)
    }

    decryptedUrl = url.replace(new RegExp(originalValue, 'g'), decryptedValue)

    cache.set(originalValue, decryptedValue, 60) // keep in cache for 1 minutes
  }

  return decryptedUrl
}

export const encryptUrlComponent = (urlComponent: string, publicKey?: string): string => {
  if(!publicKey) {
    return urlComponent
  }
  const encryptedUrlComponent = rsa.encrypt(urlComponent, publicKey)
  const encodedEncryptedUrlComponent = encodeRSA(encryptedUrlComponent)

  return `${RSA_PREFIX}${encodedEncryptedUrlComponent}`
}

export default {
  id,
  email,
  filename,
  decryptUrl,
  encryptUrlComponent
}
