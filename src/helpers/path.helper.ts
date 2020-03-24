import * as pathToRegexp from 'path-to-regexp'
import * as urlModule from 'url'

export const pathToAbsUrl = (urlPath: string, protocol = 'https') => {
  const urlPathWithoutLeadingSlash = urlPath.replace(/^\//, '')

  return `${protocol}://${urlPathWithoutLeadingSlash}`
}

export const getPathPartFactory = (template: string, index: number) => (path: string) => {
  const normalizedPath = urlModule.parse(pathToAbsUrl(path)).pathname

  const pathRegexp = pathToRegexp(template)
  const res = normalizedPath.match(pathRegexp)
  const hasId = !!(res && res.length >= index)

  if (!hasId) {
    return ''
  }

  return decodeURIComponent(res[index])
}

export const matchPath = <T>(path: string, routeMap: { [key: string]: T }): T | undefined => {
  const normalizedPath = urlModule.parse(pathToAbsUrl(path)).pathname

  const pathKey = Object
    .keys(routeMap)
    .sort((a, b) => b.length - a.length)
    .find(path => {
      return normalizedPath.search(pathToRegexp(path)) > -1
    })

  if (!pathKey) {
    return
  }

  return routeMap[pathKey]
}

export default {
  getPathPartFactory,
  pathToAbsUrl
}

