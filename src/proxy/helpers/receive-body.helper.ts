import { type IncomingMessage } from 'http'
import { type Request, type RequestPayload } from '../interfaces'

export const receiveBody = () => async (request: IncomingMessage): Promise<Request> => {
  return await new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })
    request.on('end', () => {
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

    request.on('error', (err) => {
      reject(err)
    })
  })
}
