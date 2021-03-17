import * as crypto from 'crypto'

export const encrypt = (str: string, publicKey: string): string => {
  const options = {
    key: publicKey,
    oaepHash: 'RSA-SHA512'
  }

  const buffer = Buffer.from(str)
  const encrypted = crypto.publicEncrypt(options, buffer)

  return encrypted.toString('base64')
}

export const decrypt = (toDecrypt: string, privateKey: string): string => {
  const options = {
    key: privateKey,
    oaepHash: 'RSA-SHA512'
  }

  const buffer = Buffer.from(toDecrypt, 'base64')
  const decrypted = crypto.privateDecrypt(options , buffer)

  return decrypted.toString('utf8')
}

const publicKey = process.env.RSA_PUBLIC_KEY.replace(/\\n/gm, '\n')
console.log(publicKey)

console.log(encrypt('jan@gymradio.com', publicKey))