export const toNumber = (defaultValue = 0) => (str?: string): number => {
  if (str == null) {
    return defaultValue
  }

  return Number.parseInt(str, 10)
}
