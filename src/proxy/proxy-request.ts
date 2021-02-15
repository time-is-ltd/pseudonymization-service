
import { pathToAbsUrl } from '../helpers/path.helper'
import { decryptEmail } from '../helpers/rsa'
import config from '../config'
import request from '../request'

export type AuthorizationFactory = (path: string) => Promise<string>
export type ProxyRequestDataMapper = (data: string, body?: string) => Promise<string>
export type ProxyRequestBodyMapper = (body: string, authorizationFactory: AuthorizationFactory) => Promise<string>

const proxyReguest = (
  authorizationFactory: AuthorizationFactory,
  dataMapper?: ProxyRequestDataMapper,
  bodyMapper?: ProxyRequestBodyMapper,
  urlTransform: (url: string) => string = (url) => url
) => async (req, res, next) => {

  try {
    req.url = decryptEmail(req.url, config.rsaPrivateKey)
  } catch (err) {
    res.writeHead(400, {"Content-Type": "application/json"});
    res.end(JSON.stringify({error: 'Error in RSA' }))
    return
  }
  
  const path = urlTransform(req.url)
  const url = pathToAbsUrl(path)

  let body = ''
  req.on('data', (chunk) => body += chunk.toString())

  req.on('end', async () => {
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

    const options: Record<string, unknown> = {
      method: req.method,
      headers: req.headers,
    }

    // Append body
    if (mappedBody) {
      options.data = mappedBody
    }

    const response = await request(url, options)
    const { data, headers, statusCode, statusMessage } = response

    const isSuccess = statusCode >= 200 && statusCode < 300

    if(!isSuccess) {
      res.writeHead(statusCode, statusMessage, headers)
      res.write(data)
      res.end()
      return
    }

    let mappedData = data
    if (dataMapper) {
      mappedData = await dataMapper(data, body)
    }

    // Modify headers
    // Remove content encoding
    delete headers['content-encoding']

    // Set content length
    const contentLength = Buffer.byteLength(mappedData)
    headers['content-length'] = String(contentLength)

    res.writeHead(statusCode, statusMessage, headers)

    res.write(mappedData)
    res.end()
  })
}

export default proxyReguest
