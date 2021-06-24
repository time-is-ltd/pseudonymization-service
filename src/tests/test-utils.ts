const regexDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

export const containsNothingButDomains = (str: string) => {
  if (str == null) {
    return
  }

  for (let part in str.split(' ')) {
    if (!regexDomain.test(part))
      return false
  }
  return true
}
