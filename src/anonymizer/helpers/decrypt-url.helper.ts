import { cacheFactory } from '../../cache'
import { matchAll, decryptUrlComponent } from '../helpers'
import { RSA_PREFIX } from '../constants'

const REGEXP_RSA_CONTENT = new RegExp(`/((${RSA_PREFIX}|RSA_ENCRYPTED_EMAIL_)([^/]+))`, 'gi')

const cache = cacheFactory<string>()
export const decryptUrl = (url: string, privateKey?: string): string => {
  if (!privateKey) {
    return url
  }

  const encryptedParams = matchAll(REGEXP_RSA_CONTENT, url)
  const shouldDecrypt = encryptedParams?.length > 0
  if (!shouldDecrypt) {
    // no encrypted content found
    return url
  }

  const decryptedUrl = encryptedParams
    .reduce((str, match) => {
      const encryptedParam = match[1]
      const param = cache.has(encryptedParam)
        ? cache.get(encryptedParam).v
        : decryptUrlComponent(encryptedParam, privateKey)

      cache.set(encryptedParam, param, 5 * 60) // keep in cache for 5 minutes

      return str.replace(new RegExp(encryptedParam, 'g'), param)
    }, url)

  return decryptedUrl
}
