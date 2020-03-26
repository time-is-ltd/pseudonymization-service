import { RequestHandler } from 'express'
import * as urlModule from 'url'
import * as pathToRegexp from 'path-to-regexp'
import proxyReguest, { AuthorizationFactory, ProxyRequestDataMapper } from '../proxy-request'
import multipart, { MultipartMixedPartList } from '../helpers/multipart-mixed-parser'
import { pathToAbsUrl }  from '../../helpers/path.helper'

type BatchRequestProxyMapperList = { [key: string]: ProxyRequestDataMapper }

const extractHost = (str: string) => {
  return str.split('/')[1]
}

const replaceBody = async (body: string, host: string, path: string, authorizationFactory: (path: string) => Promise<string>) => body
    .replace(new RegExp(`\/${host}`, 'gi'), '') // Remove path prefix (e.j. /www.googleapis.com)
    .replace(/Host: (.*)/gi, `Host: ${host}`) // Replace proxy host with target host (e.j. localhost:8080 with www.googleapis.com)
    .replace(/authorization(.*)/gi, `authorization: ${await authorizationFactory(path)}`) // replace authorization token with valid one

const bodyMapper = async (body: string, authorizationFactory: (path: string) => Promise<string>) => {
  const parsedBody = multipart.parse(body)

  const replacedParts: MultipartMixedPartList = {
    ...parsedBody,
    parts: await Promise.all(parsedBody.parts.map(async part => {
      const { headers, data } = part
      const path = multipart.extractPath(headers)
      const host = extractHost(path)

      if (!path) {
        return {
          headers,
          data
        }
      }

      return {
        headers: await replaceBody(headers, host, path, authorizationFactory),
        data
      }
    }))
  }
  return multipart.stringify(replacedParts)
}

const dataMapper = async (data: string, mapperList: BatchRequestProxyMapperList, body?: string): Promise<string> => {
  const { parts, separator } = multipart.parse(data, true)

  // Use mapper for every response object
  // If the mapper is not found (path is not whitelisted) return no data
  const partHandler = async (part) => {
    let mapper: Function | undefined
    // Find response by content id
    if (body) {
      const responseContentId = multipart.extractContentId(part.headers)

      const { parts: bodyParts } = multipart.parse(body)
      // Find request in body by response content id
      const bodyPart = bodyParts.find((bodyPart) => {
        const contentId = multipart.extractContentId(bodyPart.headers)
        return multipart
          .compareContentId(contentId, responseContentId)
      })

      if (bodyPart) {
        // Get pathname
        const path = multipart.extractPath(bodyPart.headers)
        const normalizedPath = urlModule.parse(pathToAbsUrl(path)).pathname

        // Find mapper by path
        const pathKey = Object
          .keys(mapperList)
          .sort((a, b) => b.length - a.length)
          .find(path => {
            return normalizedPath.search(pathToRegexp(path)) > -1
          })

        if (pathKey) {
          mapper = mapperList[pathKey]
        }
      }
    }

    const {
      headers,
      data
    } = part

    // Do not send data if the mapper was not found
    const methodAllowed = !!mapper
    if (!methodAllowed) {
      // Send correct data type
      // Empty string for text
      // [] for json array
      // {} for json object
      let placeholderData = ''
      try {
        const json = JSON.parse(data)
        if (Array.isArray(json)) {
          placeholderData = '[]'
        } else {
          placeholderData = '{}'
        }
      } catch (err) {}

      return {
        headers,
        data: placeholderData
      }
    }
  
    const mappedData = await mapper(data)

    return {
      data: mappedData,
      headers
    }
  }

  const mappedParts = await Promise.all(parts.map(partHandler))

  return multipart.stringify({
    separator,
    parts: mappedParts
  })
}

type BatchRequestHandler = (authorizationFactory: AuthorizationFactory, mapperList?: BatchRequestProxyMapperList) => RequestHandler

const batchRequestHandler: BatchRequestHandler = (authorizationFactory: AuthorizationFactory, mapperList?: BatchRequestProxyMapperList) => (req, res, next) => {
  proxyReguest(
    authorizationFactory,
    async (data: string, body?: string) => dataMapper(
      data,
      mapperList,
      body
    ),
    bodyMapper
  )(req, res, next)
}

export default batchRequestHandler
