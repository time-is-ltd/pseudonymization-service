/*
  Example request

  --===============111111111111111==
  Content-Type: application/http
  MIME-Version: 1.0
  Content-Transfer-Encoding: binary
  Content-ID: <fde099ea-e992-42a9-8cc9-ddea517ebd0f + 1>

  GET /www.googleapis.com/gmail/v1/users/me/messages?maxResults=2&alt=json HTTP/1.1
  Content-Type: application/json
  MIME-Version: 1.0
  accept: application/json
  accept-encoding: gzip, deflate
  user-agent: google-api-python-client/1.7.9 (gzip)
  authorization: Bearer token
  Host: localhost:8443


  --===============111111111111111==--
*/
/*
  Example response

  --batch_randomString
  Content-Type: application/http
  Content-ID: <response-fde099ea-e992-42a9-8cc9-ddea517ebd0f + 1>

  HTTP/1.1 200 OK
  ETag: "string"
  Content-Type: application/json; charset=UTF-8
  Date: Wed, 30 Oct 2019 08:55:45 GMT
  Expires: Wed, 30 Oct 2019 08:55:45 GMT
  Cache-Control: private, max-age=0
  Content-Length: 233

  {}

  --batch_randomString--
*/

export type MultipartMixedPart = {
  headers: string
  data?: string
}

export type MultipartMixedPartList = {
  separator: string,
  parts: MultipartMixedPart[]
}

const newLine = '\r\n'
// Multipart/mixed parser
const parse = (data: string, containsData = false): MultipartMixedPartList => {
  // Force \r\n for new lines
  const normalizedData = data
    .replace('\r\n', '\n')
    .replace('\n', '\r\n')

  // First line is the separator
  const separator = normalizedData
    .split(newLine)[0]
    .trim()

  // Split data by separator
  const parts = normalizedData
    .split(separator)
    .map(part => part.trim())
    .filter((
      part => part !== '' && // Remove empty spaces
      part !== '--' // Remove -- from the end of the request (the end of the request is in `${separator}--` format)
    ))

  const mappedParts = parts.map(part => {
    // Split content by 2 new lines (\r\n\r\n)
    const contentParts = part
      .split(newLine.repeat(2))
      .filter(value => !!value)

    const length = contentParts.length
    const headersLength = containsData ? length - 1 : length

    // Join headers
    const headers = [...contentParts] // create array copy
      .splice(0, headersLength)
      .join(newLine.repeat(2))

    // Get last part as data
    let data: string | undefined
    if (containsData) {
      data = contentParts[headersLength]
    }

    return {
      data,
      headers
    }
  })

  return {
    separator,
    parts: mappedParts
  }
}

const stringify = (partList: MultipartMixedPartList): string => {
  const { parts, separator } = partList

  // Build multipart/mixed response
  const mappedStr = parts.map((part) => {
    const {
      headers,
      data
    } = part
    let output = (
      separator + newLine +
      headers + newLine.repeat(2)
    )
    if (data) {
      output += data + newLine
    }

    return output
  }).join(newLine)

  // Add separator with -- the end of the response
  return mappedStr + '\r\n' + separator + '--'
}

const extractContentId = (str: string) => {
  const contentIdParts = str.match((/Content\-ID: <([^>]+)>/))
  if (contentIdParts == null || contentIdParts.length < 2) {
    return ''
  }

  return contentIdParts[1]
}

const extractPath = (str: string) => {
  const urlParts = str.match((/(GET|POST|PUT) ([^\s]*) (.*)/))
  if (urlParts == null || urlParts.length < 3) {
    return ''
  }

  return urlParts[2]
}

const compareContentId = (requestContentId: string, responseContentId: string) => `response-${requestContentId}` === responseContentId

export default {
  parse,
  stringify,
  compareContentId,
  extractContentId,
  extractPath
}
