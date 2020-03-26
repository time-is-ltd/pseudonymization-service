import * as crypto from 'crypto'

const algorithm = 'sha512'

export default (salt: string, str: string): string => {
  const hash = crypto.createHash(algorithm)
  const data = hash.update(`${salt}${str}`, 'utf8')

  return data.digest('hex')
}
