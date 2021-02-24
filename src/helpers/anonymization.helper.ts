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

const matchAll = (regExp: RegExp, str = '') => {
  const iterator = str.matchAll(regExp)
  return Array.from(iterator)
}

const decryptUrlCache = cacheFactory<string>()
export const decryptUrl = (url: string, privateKey?: string): string => {
  if(!privateKey) {
    return url
  }

  const rsaContentRegExp = new RegExp(`\/((${RSA_PREFIX}|RSA_ENCRYPTED_EMAIL_)([^\/]+))`, 'gi')
  const encryptedParams = matchAll(rsaContentRegExp, url)
  const shouldDecrypt = encryptedParams?.length > 0

  if (!shouldDecrypt) {
    // no encrypted content found
    return url
  }

  let decryptedUrl = url
  for (const match of encryptedParams) {
    const originalValue = match[1]
    let decryptedValue
    if (decryptUrlCache.has(originalValue)) {
      decryptedValue = decryptUrlCache.get(originalValue).v
    } else {
      const decodedValue = decodeRSA(match[3])
      decryptedValue = rsa.decrypt(decodedValue, privateKey)
    }

    decryptedUrl = decryptedUrl.replace(new RegExp(originalValue, 'g'), decryptedValue)

    decryptUrlCache.set(originalValue, decryptedValue, 5 * 60) // keep in cache for 5 minutes
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

const encryptUrlCache = cacheFactory<string>()
export const url = (url: string, publicKey?: string): string => {
  if(!publicKey) {
    return url
  }

  if (!url) {
    return url
  }

  const emailRegExp = new RegExp(`([^\/]+@[^(\/|\?)]+)`, 'gi')
  const emails = matchAll(emailRegExp, url)
  const shouldEncrypt = emails?.length > 0

  if (!shouldEncrypt) {
    return url
  }

  let encryptedUrl = url
  for (const match of emails) {
    const email = match[1]
    let encryptedValue
    if (encryptUrlCache.has(email)) {
      encryptedValue = encryptUrlCache.get(email).v
    } else {
      encryptedValue = encryptUrlComponent(email, publicKey)
    }

    encryptedUrl = encryptedUrl.replace(new RegExp(email, 'g'), encryptedValue)

    encryptUrlCache.set(email, encryptedValue, 5 * 60) // keep in cache for 5 minutes
  }

  return encryptedUrl
}

export default {
  id,
  email,
  filename,
  url,
  encryptUrlComponent,
  decryptUrl,
}
