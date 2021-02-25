import { rsa } from '../../crypto'
import { decodeRSA } from './decode-rsa.helper'
import { RSA_PREFIX } from '../constants'

export const decryptUrlComponent = (encryptedUrlComponent: string, privateKey?: string): string => {
  if(!privateKey) {
    return encryptedUrlComponent
  }

  const encryptedUrlComponentWithoutPrefix = encryptedUrlComponent.replace(new RegExp(`^${RSA_PREFIX}`), '') // remove rsa prefix from the beginning
  const decodedUrlComponent = decodeRSA(encryptedUrlComponentWithoutPrefix)
  const urlComponent = rsa.decrypt(decodedUrlComponent, privateKey)

  return urlComponent
}
