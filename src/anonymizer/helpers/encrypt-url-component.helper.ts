import { rsa } from '../../crypto'
import { encodeRSA } from './encode-rsa.helper'
import { RSA_PREFIX } from '../constants'

export const encryptUrlComponent = (urlComponent: string, publicKey?: string): string => {
  if(!publicKey) {
    return urlComponent
  }
  const encryptedUrlComponent = rsa.encrypt(urlComponent, publicKey)
  const encodedEncryptedUrlComponent = encodeRSA(encryptedUrlComponent)

  return `${RSA_PREFIX}${encodedEncryptedUrlComponent}`
}
