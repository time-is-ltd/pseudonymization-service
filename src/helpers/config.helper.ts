export const toArray = (str?: string, defaultValue: string[] = [], separator = ','): string[] => {
  if (str == null) {
    return defaultValue
  }

  return str
    .split(separator)
    .map(part => part.trim())
}

export const toBoolean = (str?: string, defaultValue: boolean = false): boolean => {
  if (str == null) {
    return defaultValue
  }

  return str.toLocaleLowerCase() === 'true'
}

export const toNumber = (str?: string, defaultValue = 0): number => {
  if (str == null) {
    return defaultValue
  }

  return Number.parseInt(str, 10)
}

export const toPem = (str?: string, defaultValue = ''): string => {
  if (str == null) {
    return defaultValue
  }

  return str.replace(/\\n/gm, '\n')
}
