import * as emailAddresses from 'email-addresses'
import { sha512, rsa } from '../crypto'

export type AnonymizeEmailConfig = {
  anonymizeInternalEmailUsername: boolean,
  anonymizeExternalEmailUsername: boolean,
  anonymizeInternalEmailDomain: boolean,
  anonymizeExternalEmailDomain: boolean,
  internalDomainList: string[],
  anonymizationSalt: string
}

const RSA_PREFIX = '@rsa:'
const ID_PREFIX = '@id:'

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

export const decryptUrl = (url: string, privateKey?: string): string => {
  if(!privateKey) {
    return url
  }

  const rsaContentRegExp = new RegExp(`((${RSA_PREFIX}|RSA_ENCRYPTED_EMAIL_)([^\/]+))`, 'i')
  const valueRexExpMatchArray = url.match(rsaContentRegExp)
  const shouldDecrypt = valueRexExpMatchArray?.length === 4

  if (!shouldDecrypt) {
    // no encrypted content found
    return url
  }

  const decodedValue = decodeURIComponent(valueRexExpMatchArray[3])
  const decryptedValue = rsa.decrypt(decodedValue, privateKey)

  return url
    .replace(valueRexExpMatchArray[1], decryptedValue)
}

export const encryptUrlComponent = (urlComponent: string, publicKey?: string): string => {
  if(!publicKey) {
    return urlComponent
  }
  const encryptedUrlComponent = rsa.encrypt(urlComponent, publicKey)
  const encodedEncryptedUrlComponent = encodeURIComponent(encryptedUrlComponent)

  return `${RSA_PREFIX}${encodedEncryptedUrlComponent}`
}

export default {
  id,
  email,
  filename,
  decryptUrl,
  encryptUrlComponent
}
