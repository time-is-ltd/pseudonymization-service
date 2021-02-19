export const toPem = (defaultValue = '') => (str?: string): string => {
  if (!str) {
    return defaultValue
  }

  return str.replace(/\\n/gm, '\n')
}
