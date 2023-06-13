const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?!&//=]*)/gi

/**
 * Extracts valid URLs, if any, from the specified string.
 * @param str
 */
const extractURLs = (str: string) => {
  return str.match(regexp)
}

export default extractURLs
