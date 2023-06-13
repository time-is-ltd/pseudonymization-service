import multipart from './multipart-mixed.parser'

const normalizeNewLine = (str: string) => str.replace('\n', '\r\n')
const REQUEST_SEPARATOR = '--===============111111111111111=='
const REQUEST_HEADER = normalizeNewLine(`content-type: application/http
content-id: <fde099ea-e992-42a9-8cc9-ddea517ebd0f + 1>
content-transfer-encoding: binary
mime-version: 1.0`)
const REQUEST_PARSED_HEADER = { 'content-id': '<fde099ea-e992-42a9-8cc9-ddea517ebd0f + 1>', 'content-transfer-encoding': 'binary', 'content-type': 'application/http', 'mime-version': '1.0' }

const REQUEST_BODY = 'Test body'

const RESPONSE_SEPARATOR = '--batch_randomString'
const RESPONSE_HEADER = normalizeNewLine(`content-type: application/http
content-id: <response-fde099ea-e992-42a9-8cc9-ddea517ebd0f + 1>`)
const RESPONSE_PARSED_HEADER = { 'content-id': '<response-fde099ea-e992-42a9-8cc9-ddea517ebd0f + 1>', 'content-type': 'application/http' }
const RESPONSE_BODY = '{}'

const buildMultipart = (iterations: number = 1, separator: string, header: string, body: string, newLine = '\r\n') => {
  if (iterations < 1) {
    throw new Error('Iterations param must be positive int')
  }

  let output = ''

  for (let i = 1; i <= iterations; i++) {
    output += `${separator}${newLine}${header}${newLine.repeat(2)}${body}${newLine.repeat(2)}`
  }

  output += `${separator}--`

  return output
}

const buildParseTest = (iterations: number = 1, separator: string, header: string, body: string, parsedHeader: Record<string, unknown>, newLine = '\r\n') => {
  const input = buildMultipart(iterations, separator, header, body, newLine)
  const parsedInput = multipart.parse(input)

  expect(parsedInput.separator).toBe(separator)

  expect(parsedInput.parts.length).toBe(iterations)

  for (const part of parsedInput.parts) {
    expect(part.headers).toEqual(parsedHeader)
    expect(part.body).toBe(body)
  }
}

const buildStringifyTest = (iterations: number = 1, separator: string, header: string, body: string) => {
  const input = buildMultipart(iterations, separator, header, body)

  const parsedInput = multipart.parse(input)

  const output = multipart.stringify(parsedInput)

  expect(input).toBe(output)
}

const iterations = [1, 3, 10]
test('Parse multipart/mixed request', () => {
  iterations.forEach((i) => {
    buildParseTest(i, REQUEST_SEPARATOR, REQUEST_HEADER, REQUEST_BODY, REQUEST_PARSED_HEADER)
  })
})

test('Parse multipart/mixed request with LF as a break line', () => {
  iterations.forEach((i) => {
    buildParseTest(i, REQUEST_SEPARATOR, REQUEST_HEADER, REQUEST_BODY, REQUEST_PARSED_HEADER, '\n')
  })
})

test('Parse multipart/mixed without headers', () => {
  iterations.forEach((i) => {
    buildParseTest(i, REQUEST_SEPARATOR, '', REQUEST_BODY, {})
  })
})

test('Parse multipart/mixed with without body', () => {
  iterations.forEach((i) => {
    buildParseTest(i, REQUEST_SEPARATOR, REQUEST_HEADER, '', REQUEST_PARSED_HEADER)
  })
})

test('Parse multipart/mixed with newline in the header', () => {
  iterations.forEach((i) => {
    buildParseTest(i, REQUEST_SEPARATOR, '\r\n\r\n\r\n' + REQUEST_HEADER, REQUEST_BODY, REQUEST_PARSED_HEADER)
  })
})

test('Parse multipart/mixed response', () => {
  iterations.forEach((i) => {
    buildParseTest(i, RESPONSE_SEPARATOR, RESPONSE_HEADER, RESPONSE_BODY, RESPONSE_PARSED_HEADER)
  })
})

test('Stringify multipart/mixed response', () => {
  iterations.forEach((i) => {
    buildStringifyTest(i, RESPONSE_SEPARATOR, RESPONSE_HEADER, RESPONSE_BODY)
  })
})
