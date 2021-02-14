import * as https from 'https'
import * as http from 'http'
import { IncomingMessage } from 'http'

export const request = async (url: string, options: Partial<Pick<https.RequestOptions, 'method' | 'headers'> & { data: unknown }> = {}) => {
  return new Promise<Pick<IncomingMessage, 'statusCode' | 'statusMessage' | 'headers'> & { data?: string }>((resolve, reject) => {
    const { data, headers = {}, method = 'GET' } = options
    const { protocol, hostname, port, pathname, search } = new URL(url)

    const path = `${pathname}${search}`
    const requestOptions: Record<string, unknown> = {
      protocol,
      hostname,
      port,
      path,
      method,
      headers,
    }
    const provider = protocol.includes('https') ? https : http
    const req = provider.request(requestOptions, response => {
      let data = ''
      response.on('data', (chunk) => data += chunk.toString())
      response.on('end', () => {
        const { headers, statusCode, statusMessage } = response
        resolve({ headers, statusCode, statusMessage, data })
      })
      response.on('error', err => reject(err))
    })
    if (data) {
      req.write(data)
    }
    req.on('error', err => reject(err))
    req.end()
  })
}

export default request
