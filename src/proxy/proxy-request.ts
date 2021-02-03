
import axios from 'axios'
import { pathToAbsUrl } from '../helpers/path.helper'
import { decryptEmail } from '../helpers/rsa'
import config from '../config'

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

    const options: any = {
      method: req.method,
      url,
      transformResponse: [],
      headers: req.headers,
      // Do not throw exception on error
      validateStatus: (status: number) => true
    }

    // Append body
    if (mappedBody) {
      options.data = mappedBody
    }

    const response = await axios(options)
    const { data, headers, status, statusText } = response

    const isSuccess = status >= 200 && status < 300

    if(!isSuccess) {
      res.writeHead(status, statusText, headers)
      res.write(data)
      res.end()
      return
    }

    let mappedData = data
    if (dataMapper) {
      mappedData = await dataMapper(data, body)
    }

    const contentLength = Buffer.byteLength(mappedData)

    headers['content-length'] = contentLength

    res.writeHead(status, statusText, headers)

    res.write(mappedData)
    res.end()
  })
}

export default proxyReguest

