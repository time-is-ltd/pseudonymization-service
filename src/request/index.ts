import * as https from 'https'
import * as http from 'http'
import * as zlib from 'zlib'
import { IncomingMessage } from 'http'

export type RequestOptions = Partial<Pick<https.RequestOptions, 'method' | 'headers'> & { data: unknown }>
type Response = Pick<IncomingMessage, 'statusCode' | 'statusMessage' | 'headers'> & { data?: string }

export class RequestError<T extends unknown> extends Error {
  constructor (
    public statusCode: number,
    public statusMessage?: string,
    public response?: T,
    public data?: string
  ) {
    super(statusMessage)
  }
}

const decompressResponse = (response: IncomingMessage) => {
  switch (response.headers['content-encoding']) {
    case 'gzip':
      return response.pipe(zlib.createGunzip())
    case 'deflate':
      return response.pipe(zlib.createInflate())
    default:
      return response
  }
}

export const request = async (url: string, options: RequestOptions = {}) => {
  return await new Promise<Response>((resolve, reject) => {
    const { data, headers = {}, method = 'GET' } = options
    const { protocol, hostname, port, pathname, search } = new URL(url)

    const path = `${pathname}${search}`
    const requestOptions: Record<string, unknown> = {
      protocol,
      hostname,
      port,
      path,
      method,
      headers
    }
    const provider = protocol.includes('https') ? https : http
    const req = provider.request(requestOptions, response => {
      const decompressedResponse = decompressResponse(response)

      let data = ''
      decompressedResponse.on('data', (chunk) => data += chunk.toString())
      decompressedResponse.on('end', () => {
        const { headers, statusCode, statusMessage } = response
        const isSuccess = statusCode >= 200 && statusCode < 300
        const shouldReject = !isSuccess
        if (shouldReject) {
          return reject(new RequestError(statusCode, statusMessage, response, data))
        }

        resolve({ headers, statusCode, statusMessage, data })
      })
      decompressedResponse.on('error', err => reject(err))
    })
    if (data) {
      req.write(data)
    }
    req.on('error', err => reject(err))
    req.end()
  })
}

export default request
