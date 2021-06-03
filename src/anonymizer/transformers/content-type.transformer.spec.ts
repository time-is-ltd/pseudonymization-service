import { contentType } from './content-type.transformer'

test('Anonymize content type', () => {
  const mimeTypes = [
    'text/html; charset=utf-8; param1=value1; param2=value2; name=test.ext',
    'text/html',
    'text/html;name=test.ext',
    'text/html; name=test.ext; param1=value1; param2=value2',
    'name=test.ext',
    'text/html; name="test.ext"',
    'text/html; name=\"test.ext\"',
    'text/html; param1=value1; name=\"test.ext\"; param2=value2'
  ]

  const results = [
    'text/html; charset=utf-8; param1=value1; param2=value2; name=xxxx.ext',
    'text/html',
    'text/html;name=xxxx.ext',
    'text/html; name=xxxx.ext; param1=value1; param2=value2',
    'name=xxxx.ext',
    'text/html; name="xxxx.ext"',
    'text/html; name=\"xxxx.ext\"',
    'text/html; param1=value1; name=\"xxxx.ext\"; param2=value2'
  ]

  mimeTypes.forEach((key: string, index: number) => {
    const value = results[index]
    expect(contentType(key)).toBe(value)
  })
})
