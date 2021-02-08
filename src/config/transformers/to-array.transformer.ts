export const toArray = (defaultValue: string[] = [], separator = ',') => (str?: string): string[] => {
  if (str == null) {
    return defaultValue
  }

  return str
    .split(separator)
    .map(part => part.trim())
}
