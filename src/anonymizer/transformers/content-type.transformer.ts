import { filename } from './filename.transformer'

const contentTypeNameRegexp = /(name=\\?"?([^;]+)\\?"?)/

export const contentType = (value: string) => {
  const parts = value.match(contentTypeNameRegexp)

  if (parts == null) {
    return value
  }

  const fileName = parts[2]
  return value.replace(fileName, filename(fileName))
}
