import { sha512 } from '../../crypto'

export const hash = (str: string, salt: string, length = 16) => {
  return sha512.createHash(salt, str).substr(0, length)
}
