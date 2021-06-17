import * as emailAddresses from 'email-addresses'
import { encryptUrlComponent, hash } from '../helpers'
import { ID_PREFIX } from '../constants'

interface AnonymizeIdConfig {
  rsaPublicKey: string
  anonymizationSalt: string
}

export const id = (value: string, config: AnonymizeIdConfig) => {
  const { rsaPublicKey, anonymizationSalt } = config
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
