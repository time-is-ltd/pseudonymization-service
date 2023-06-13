import { cacheFactory } from '../../cache'
import { encryptUrlComponent, matchAll } from '../helpers'

const REGEXP_EMAIL = /([^/]+@[^(/|?)]+)/gi

const cache = cacheFactory<string>()
export const url = (url: string, publicKey?: string): string => {
  if (!publicKey) {
    return url
  }

  if (!url) {
    return url
  }

  const emails = matchAll(REGEXP_EMAIL, url)
  const shouldEncrypt = emails?.length > 0

  if (!shouldEncrypt) {
    return url
  }

  const encryptedUrl = emails
    .reduce((str, match) => {
      const email = match[1]
      const encryptedEmail = cache.has(email)
        ? cache.get(email).v
        : encryptUrlComponent(email, publicKey)

      cache.set(email, encryptedEmail, 5 * 60) // keep in cache for 5 minutes

      return str.replace(new RegExp(email, 'g'), encryptedEmail)
    }, url)

  return encryptedUrl
}
