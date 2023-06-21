export const toSnakeCase = (s = '') => s
  .replace(/(?:^|\.?)([A-Z])/g, (_: string, y: string) => `_${y.toLowerCase()}`)
  .replace(/^_/, '')
