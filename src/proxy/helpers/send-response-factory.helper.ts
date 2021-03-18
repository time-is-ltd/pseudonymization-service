import { OutgoingHttpHeaders, ServerResponse } from 'http'

interface ResponseOptions {
  statusCode?: number
  statusMessage?: string
  headers?: OutgoingHttpHeaders
  allowedHeaders?: string[]
  data?: string
}

export const sendResponseFactory = (response: ServerResponse) => (options: ResponseOptions = {}) => {
  const { statusCode = 500, statusMessage, headers = {}, allowedHeaders = [], data = '{}' } = options
  const contentLength = Buffer.byteLength(data)

  // Add allowed incoming headers to the outgoing headers
  const outgoingHeaders: OutgoingHttpHeaders = allowedHeaders
    .reduce((obj, headerName) => {
      if (headers[headerName]) {
        obj[headerName] = headers[headerName]
      }
      return obj
    }, {})

  // Set content length
  outgoingHeaders['content-length'] = contentLength

  // Set content type
  outgoingHeaders['content-type'] = headers['content-type'] ?? 'application/json'

  // This fixes bug in writeHead function
  // if statusMessage is null, headers are not send
  if (statusMessage) {
    response.writeHead(statusCode, statusMessage, outgoingHeaders)
  } else {
    response.writeHead(statusCode, outgoingHeaders)
  }

  response.write(data)
  response.end()
}
