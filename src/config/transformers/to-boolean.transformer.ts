export const toBoolean = (defaultValue = false) => (str?: string): boolean => {
  if (str == null) {
    return defaultValue
  }

  return str.toLocaleLowerCase() === 'true'
}
