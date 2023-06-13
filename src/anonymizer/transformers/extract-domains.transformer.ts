import extractURLs from '../../helpers/extract-urls'
import { URL } from 'url'

/**
 * Extracts parts of a string containing domains, stripping everything else.
 * A whitelist can be used to limit allowed domains (with subdomains allowed, i.e. if zoom.us is whitelisted,
 * us02.zoom.us is allowed).
 * @param value
 * @param whiteList
 */
export const extractDomains = (value: string, extract: boolean, whiteList: string[] = undefined) => {
  if (!extract) {
    return ''
  }

  const result = new Set()
  extractURLs(value)?.forEach(extractedUrl => {
    const host = new URL(extractedUrl).host
    if (whiteList && (whiteList.length > 0)) {
      for (const whiteListed of whiteList) {
        if (host.endsWith(whiteListed)) {
          result.add(host)
          break
        }
      }
    } else {
      result.add(host)
    }
  })
  return Array.from(result).join(' ')
}
