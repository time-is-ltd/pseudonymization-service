
import { pathToAbsUrl } from '../helpers/path.helper'
import { decryptEmail } from '../helpers/rsa'
import config from '../config'
import { request, RequestError, RequestOptions } from '../request'
import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http'

export type AuthorizationFactory = (path: string) => Promise<string>
export type ProxyRequestDataMapper = (data: string, body?: string) => Promise<string>
export type ProxyRequestBodyMapper = (body: string, authorizationFactory: AuthorizationFactory) => Promise<string>

interface ResponseOptions {
  statusCode?: number
  statusMessage?: string
  headers?: OutgoingHttpHeaders
  data?: string
}

const response = (response: ServerResponse) => (options: ResponseOptions = {}) => {
  const { statusCode = 500, statusMessage, headers = {}, data = '{}' } = options
  const contentLength = Buffer.byteLength(data)

  // Modify headers
  // Remove content encoding
  delete headers['content-encoding']

  // Set content length
  headers['content-length'] = contentLength

  // Set content type
  if (!headers['content-type']) {
    headers['content-type'] = 'application/json'
  }

  // This fixes bug in writeHead function
  // if statusMessage is null, headers are not send
  if (statusMessage) {
    response.writeHead(statusCode, statusMessage, headers)
  } else {
    response.writeHead(statusCode, headers)
  }

  response.write(data)
  response.end()
}

const proxyReguest = (
  authorizationFactory: AuthorizationFactory,
  dataMapper?: ProxyRequestDataMapper,
  bodyMapper?: ProxyRequestBodyMapper,
  urlTransform: (url: string) => string = (url) => url
) => async (req: IncomingMessage, res: ServerResponse, _) => {
  const sendResponse = response(res)

  try {
    req.url = decryptEmail(req.url, config.rsaPrivateKey)
  } catch (err) {
    sendResponse({
      statusCode: 400,
      data: JSON.stringify({ error: 'Error in RSA' })
    })
    return
  }

  const path = urlTransform(req.url)
  const url = pathToAbsUrl(path)

  let body = ''
  req.on('data', (chunk) => body += chunk.toString())
  req.on('end', async () => {
    try {
      let mappedBody = body

      if (body && bodyMapper) {
        mappedBody = await bodyMapper(body, authorizationFactory)
      }

      // Remove host header
      delete req.headers.host

      // Append authorization header
      const authorization = await authorizationFactory(req.url)
      if (authorization) {
        req.headers.authorization = authorization
      }

      // Remove content length from the request
      delete req.headers['content-length']

      const options: RequestOptions = {
        method: req.method,
        headers: req.headers
      }

      // Append body
      if (mappedBody) {
        options.data = mappedBody
      }

      const response = await request(url, options)
      const { data, headers, statusCode, statusMessage } = response

      let mappedData = data
      if (dataMapper) {
        mappedData = await dataMapper(data, body)
      }

      sendResponse({
        headers,
        statusCode,
        statusMessage,
        data: mappedData
      })
    } catch (err) {
      console.error(err)
      if (err instanceof RequestError) {
        const { statusCode, statusMessage } = err
        return sendResponse({
          statusCode,
          statusMessage
        })
      }

      // Unknown error
      sendResponse({
        statusCode: 500,
        statusMessage: 'Unknown error'
      })
    }
  })
}

export default proxyReguest
