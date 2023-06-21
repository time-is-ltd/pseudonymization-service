import { type RequestHandler } from 'express'
import { URL } from 'url'
import { type IncomingHttpHeaders } from 'http'
import { pathToRegexp } from 'path-to-regexp'
import {
  type AuthorizationFactory,
  type DataMapper,
  decryptUrlMiddleware,
  modifyHeadersMiddleware,
  pathToAbsUrl,
  proxyFactory
} from '../../../proxy'
import multipart, {
  type MultipartMixedPart,
  type MultipartMixedPartList
} from '../../../proxy/parsers/multipart-mixed.parser'

type BatchRequestProxyMapperList = Record<string, DataMapper>

const extractHost = (str: string): string => {
  return str.split('/')[1]
}

const parseStatus = (status: string) => {
  const urlParts = status.match((/(GET|POST|PUT) ([^\s]*) (.*)/))
  if (!(urlParts?.length >= 3)) {
    throw new Error('Not a https status code')
  }

  return {
    method: urlParts[1],
    url: urlParts[2],
    protocol: urlParts[3]
  }
}

interface ParsedBody {
  headers: IncomingHttpHeaders
  status: string
  body?: string
}

const parseBody = (part: string): ParsedBody => {
  const parsedPart = part
    .split(/(\n\n|\r\n\r\n)/)
    .filter(v => v.trim())

  const { headers, status } = parsedPart[0]
    .split(/(\n|\r\n)/)
    .reduce((obj, str, i) => {
      if (i === 0) {
        obj.status = str
        return obj
      }
      obj.headers = multipart.parseHeaders(str)
      return obj
    }, { headers: {}, status: '' })

  return {
    headers,
    status,
    body: parsedPart[1]
  }
}

const stringifyBody = (parsedBody: ParsedBody, data?: string | Record<string, unknown>) => {
  const stringifyHeaders = (headers: IncomingHttpHeaders): string => {
    return Object.keys(headers)
      .map(key => {
        const value = headers[key]
        return `${key}: ${value.toString()}`
      })
      .join('\n')
  }

  let body = `${parsedBody.status}\r\n${stringifyHeaders(parsedBody.headers)}`
  if (data) {
    body += `\r\n\r\n${String(data)}`
  }

  return body
}

const bodyMapper = async (body: string, authorizationFactory: (path: string) => Promise<string>) => {
  const parsedBody = multipart.parse(body)

  const replacedParts: MultipartMixedPartList = {
    ...parsedBody,
    parts: await Promise.all(parsedBody.parts.map(async part => {
      const { headers, body } = part
      const parsedBody = parseBody(body)

      const request = await Promise
        .resolve({
          ...parsedBody,
          ...parseStatus(parsedBody.status)
        })
        .then(decryptUrlMiddleware())
        .then(modifyHeadersMiddleware(authorizationFactory, false))

      const path = request.url
      const host = extractHost(path)

      const url = request.url.replace(new RegExp(`/${host}`, 'gi'), '') // Remove path prefix (e.g. /www.googleapis.com)
      const status = `${request.method} ${url} ${request.protocol}`
      const bodyStr = stringifyBody({ status, headers: request.headers })

      return {
        headers,
        body: bodyStr
      }
    }))
  }

  return multipart.stringify(replacedParts)
}

const normalizeContentId = (contentId?: string) => {
  if (!contentId) {
    return ''
  }

  return contentId
    .replace(/^</, '')
    .replace(/>$/, '')
}

const dataMapper = async (data: string, mapperList: BatchRequestProxyMapperList, bodyRaw?: string): Promise<string> => {
  const { parts, separator } = multipart.parse(data)

  const { parts: bodyParts } = multipart.parse(bodyRaw)
  const responseMapperMap = bodyParts
    .reduce((map: Record<string, DataMapper>, part) => {
      const contentId = normalizeContentId(part.headers['content-id'] as string)

      const parsedBody = parseBody(part.body)

      const parsedStatus = parseStatus(parsedBody.status)

      const path = parsedStatus.url
      const normalizedPath = new URL(pathToAbsUrl(path)).pathname
      // Find mapper by path
      const pathKey = Object
        .keys(mapperList)
        .sort((a, b) => b.length - a.length)
        .find(path => {
          return normalizedPath.search(pathToRegexp(path)) > -1
        })

      map[`response-${contentId}`] = mapperList[pathKey]
      return map
    }, {})

  // Use mapper for every response object
  // If the mapper is not found (path is not whitelisted) return no data
  const partHandler = async (part: MultipartMixedPart) => {
    const parsedBody = parseBody(part.body)

    const responseContentId = normalizeContentId(part.headers['content-id'] as string)
    const mapper: DataMapper | undefined = responseMapperMap[responseContentId]

    // Do not send data if the mapper was not found
    const methodAllowed = !(mapper == null)
    if (!methodAllowed) {
      // Send correct data type
      // Empty string for text
      // [] for json array
      // {} for json object
      let placeholderData = ''
      try {
        const json = JSON.parse(parsedBody.body)
        if (Array.isArray(json)) {
          placeholderData = '[]'
        } else {
          placeholderData = '{}'
        }
      } catch (err) {}

      return {
        headers: part.headers,
        body: stringifyBody(parsedBody, placeholderData)
      }
    }

    const mappedData = await mapper(parsedBody.body)

    return {
      headers: part.headers,
      body: stringifyBody(parsedBody, mappedData)
    }
  }

  const mappedParts = await Promise.all(parts.map(partHandler))
  return multipart.stringify({
    separator,
    parts: mappedParts
  })
}

type BatchHandler = (authorizationFactory: AuthorizationFactory, mapperList?: BatchRequestProxyMapperList) => RequestHandler

const batchHandler: BatchHandler = (authorizationFactory: AuthorizationFactory, mapperList?: BatchRequestProxyMapperList) => (req, res, next) => {
  proxyFactory({
    authorizationFactory,
    dataMapper: async (data: string, body?: string) => await dataMapper(
      data,
      mapperList,
      body
    ),
    bodyMapper
  })(req, res, next)
}

export default batchHandler
