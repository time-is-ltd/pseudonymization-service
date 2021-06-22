const stringify = (obj: unknown) => JSON.stringify(obj, null, 2)
const isObject = (maybeObj): maybeObj is Object => maybeObj === Object(maybeObj)

const prettify = (message: unknown) => {
  try {
    if (typeof message === 'string') {
      return stringify(JSON.parse(message))
    }

    if (isObject(message)) {
      // Stringify json only
      const isJson = message.toString() === '[object Object]'
      if (isJson) {
        return stringify(message)
      }
    }
    return message
  } catch (e) {
    return message
  }
}

export default prettify