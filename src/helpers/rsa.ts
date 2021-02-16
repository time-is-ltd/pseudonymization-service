import * as crypto from 'crypto'

export const encrypt = (str: string, publicKey: string): string => {
  const options = {
    key: publicKey,
    oaepHash: 'RSA-SHA512'
  }

  const buffer = Buffer.from(str)
  const encrypted = crypto.publicEncrypt(options, buffer)
  const encryptedBase64 = encrypted.toString('base64')
  return encodeURIComponent(encryptedBase64)
}

export const decrypt = (toDecrypt: string, privateKey: string): string => {
  const decodedRsa = decodeURIComponent(toDecrypt)

  const options = {
    key: privateKey,
    oaepHash: 'RSA-SHA512',
  }

  const buffer = Buffer.from(decodedRsa, 'base64')
  const decrypted = crypto.privateDecrypt(options , buffer)
  return decrypted.toString('utf8')
}

export const decryptEmail = (str: string, privateKey?: string): string => {
  if(!privateKey) {
    return str
  }

  const content = str.match(/(RSA_ENCRYPTED_EMAIL_([^/]*))/)
  const shouldDecrypt = content?.length === 3

  if (!shouldDecrypt) {
    // no encrypted content found
    return str
  }

  return str
    .replace(content[1], decrypt(content[2], privateKey))
}

export default {
  decryptEmail
}
