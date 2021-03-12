
import { decryptUrlMiddleware, mapBodyMiddleware, modifyHeadersMiddleware, transformUrlMiddleware } from './middlewares'
import { AuthorizationFactory, DataMapper, BodyMapper, Request, RequestPayload } from './interfaces'
import { request as makeRequest, RequestError, RequestOptions } from '../request'
import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http'

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

type Response = ServerResponse
interface Data {
  request: IncomingMessage & {
    body?: string
  }
  response: Response
}

const receiveBody = () => async ({ request }: Data): Promise<Request> => {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => body += chunk.toString())
    request.on('end', async () => {
      const originalRequest: RequestPayload = {
        url: request.url,
        protocol: `HTTP/${request.httpVersion}`,
        method: request.method,
        headers: request.headers,
        body
      }
      resolve({
        ...originalRequest,
        originalRequest
      })
    })

    request.on('error', (err) => reject(err))
  })
}

const proxyReguest = (
  authorizationFactory: AuthorizationFactory,
  dataMapper?: DataMapper,
  bodyMapper?: BodyMapper,
  urlTransform: (url: string) => string = (url) => url
) => async (req: IncomingMessage, res: ServerResponse, _) => {
  const sendResponse = response(res)
  Promise
    .resolve<Data>({ request: req, response: res })
    .then(receiveBody())
    .then(mapBodyMiddleware(authorizationFactory, bodyMapper))
    .then(decryptUrlMiddleware())
    .then(modifyHeadersMiddleware(authorizationFactory))
    .then(transformUrlMiddleware(urlTransform))
    .then(async request => {
      const { method, headers, body, originalRequest, url } = request
      const options: RequestOptions = {
        method,
        headers
      }

      // Append body
      if (body) {
        options.data = body
      }

      const response = await makeRequest(url, options)

      return {
        request: originalRequest,
        response
      }
    })
    .then(async ({ request, response }) => {
      const { data, headers, statusCode, statusMessage } = response

      const mappedData = dataMapper
        ? await dataMapper(data, request.body)
        : data

      sendResponse({
        headers,
        statusCode,
        statusMessage,
        data: mappedData
      })
    })
    .catch(err => {
      console.log(err)
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
    })
}

export default proxyReguest
