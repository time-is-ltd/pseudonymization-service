import { match, type MatchResult } from 'path-to-regexp'
import { URL } from 'url'

export const pathToAbsUrl = (urlPath: string, protocol = 'https') => {
  const urlPathWithoutLeadingSlash = urlPath.replace(/^\//, '')

  return `${protocol}://${urlPathWithoutLeadingSlash}`
}

export const transformPath = <P extends Record<string, unknown>>(template: string, transform: (params: MatchResult<P>) => string) => (path: string) => {
  const normalizedPath = new URL(pathToAbsUrl(path)).pathname

  const fn = match<P>(template)
  const result = fn(normalizedPath)

  if (!result) {
    throw new Error('Template not matched')
  }

  return transform({
    ...result,
    path
  })
}

export const findTemplateAndMatch = <P extends Record<string, unknown>>(templates: string[]) => (path: string) => {
  const normalizedPath = new URL(pathToAbsUrl(path)).pathname

  for (const template of templates) {
    const result = match<P>(template)(normalizedPath)
    if (result) {
      return result
    }
  }
}

export default {
  transformPath,
  findTemplateAndMatch,
  pathToAbsUrl
}
