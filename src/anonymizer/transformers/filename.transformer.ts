export const filename = (filename = ''): string => {
  const index = filename.lastIndexOf('.')
  const hasExtension = index > -1

  const length = hasExtension
    ? filename.substr(0, index).length
    : filename.length
  const extension = hasExtension
    ? filename.substr(index)
    : ''

  const anonymizedFilename = 'x'.repeat(length)

  return `${anonymizedFilename}${extension}`
}
