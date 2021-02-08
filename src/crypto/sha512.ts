import * as crypto from 'crypto'

const algorithm = 'sha512'

export const createHash = (salt: string, str: string): string => {
  const hash = crypto.createHash(algorithm)
  const data = hash.update(`${salt}${str}`, 'utf8')

  return data.digest('hex')
}
