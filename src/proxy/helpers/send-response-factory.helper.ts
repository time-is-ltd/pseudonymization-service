import { OutgoingHttpHeaders, ServerResponse } from 'http'

interface ResponseOptions {
  statusCode?: number
  statusMessage?: string
  headers?: OutgoingHttpHeaders
  data?: string
}

export const sendResponseFactory = (response: ServerResponse) => (options: ResponseOptions = {}) => {
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
