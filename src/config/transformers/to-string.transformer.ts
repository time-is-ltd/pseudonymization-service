export const toString = (defaultValue = '') => (str?: string): string => {
  return str || defaultValue
}
