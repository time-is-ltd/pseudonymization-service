const stringify = (obj: any) => JSON.stringify(obj, null, 2)

const prettifyRequestData = (message: unknown): string => {
  try {
    if (typeof message === 'string') {
      return stringify(JSON.parse(message))
    } else {
      return stringify(message)
    }
  } catch (e) {
    return 'Unable to parse message'
  }
}

export default prettifyRequestData
