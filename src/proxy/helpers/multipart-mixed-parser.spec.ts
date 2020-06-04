import multipart from './multipart-mixed-parser'

const REQUEST_SEPARATOR = `--===============111111111111111==`
const REQUEST_HEADER = `Content-Type: application/http
MIME-Version: 1.0
Content-Transfer-Encoding: binary
Content-ID: <fde099ea-e992-42a9-8cc9-ddea517ebd0f + 1>`
const REQUEST_HEADER_2 = `GET /www.googleapis.com/gmail/v1/users/me/messages?maxResults=2&alt=json HTTP/1.1
Content-Type: application/json
MIME-Version: 1.0
accept: application/json
accept-encoding: gzip, deflate
user-agent: google-api-python-client/1.7.9 (gzip)
authorization: Bearer token
Host: localhost:8443`

const RESPONSE_SEPARATOR = `--batch_randomString`
const RESPONSE_HEADER = `Content-Type: application/http
Content-ID: <response-fde099ea-e992-42a9-8cc9-ddea517ebd0f + 1>`
const RESPONSE_HEADER_2 = `HTTP/1.1 200 OK
ETag: "string"
Content-Type: application/json; charset=UTF-8
Date: Wed, 30 Oct 2019 08:55:45 GMT
Expires: Wed, 30 Oct 2019 08:55:45 GMT
Cache-Control: private, max-age=0
Content-Length: 233`
const RESPONSE_CONTENT = `{}`

const buildMultipart = (iterations: number = 1, separator: string, header: string, header2: string, content?: string) => {
  if (iterations < 1) {
    throw new Error('Iterations param must be positive int')
  }

  let output = ''

  for (let i = 1; i <= iterations; i++) {
    output += `${separator}\r\n${header}\r\n\r\n${header2}\r\n\r\n`

    if (content) {
      output += `${content}\r\n\r\n`
    } else {
      output += `\r\n`
    }
  }

  output += `${separator}--`

  return output
}

const buildParseTest = (iterations: number = 1, separator: string, header: string, header2: string, content?: string) => {
  const input = buildMultipart(iterations, separator, header, header2, content)
  const parsedInput = multipart.parse(input, !!content)

  expect(parsedInput.separator).toBe(separator)

  expect(parsedInput.parts.length).toBe(iterations)

  const firstPart = parsedInput.parts[0]

  expect(firstPart.headers).toBe(`${header.replace(/^(\r\n)+/, '')}\r\n\r\n${header2}`)

  if (content) {
    expect(firstPart.data).toBe(content)
  }
}

const buildStringifyTest = (iterations: number = 1, separator: string, header: string, header2: string, content?: string) => {
  const input = buildMultipart(iterations, separator, header, header2, content)

  const parsedInput = multipart.parse(input, !!content)

  const output = multipart.stringify(parsedInput)

  expect(input).toBe(output)
}

const iterations = [1, 10, 100, 1000, 10000]
test('Parse multipart/mixed request', () => {
  iterations.forEach((i) => {
    buildParseTest(i, REQUEST_SEPARATOR, REQUEST_HEADER, REQUEST_HEADER_2)
  })
})

test('Parse multipart/mixed with newline in the header', () => {
  iterations.forEach((i) => {
    buildParseTest(i, REQUEST_SEPARATOR, '\r\n\r\n\r\n' + REQUEST_HEADER, REQUEST_HEADER_2)
  })
})

test('Parse multipart/mixed response', () => {
  iterations.forEach((i) => {
    buildParseTest(i, RESPONSE_SEPARATOR, RESPONSE_HEADER, RESPONSE_HEADER_2, RESPONSE_CONTENT)
  })
})

test('Stringify multipart/mixed request', () => {
  iterations.forEach((i) => {
    buildStringifyTest(i, REQUEST_SEPARATOR, REQUEST_HEADER, REQUEST_HEADER_2)
  })
})

test('Stringify multipart/mixed response', () => {
  iterations.forEach((i) => {
    buildStringifyTest(i, RESPONSE_SEPARATOR, RESPONSE_HEADER, RESPONSE_HEADER_2, RESPONSE_CONTENT)
  })
})
