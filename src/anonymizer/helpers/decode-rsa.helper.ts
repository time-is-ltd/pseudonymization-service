export const decodeRSA = (str = ''): string => {
  const tail = Array(5 - str.length % 4).join('=') // Add removed at end '='
  const decodedStr = str
    .replace(/-/g, '+') // Convert '-' to '+'
    .replace(/_/g, '/') // Convert '_' to '/'

  return `${decodedStr}${tail}`
}
