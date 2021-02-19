export const toSnakeCase = (s = '') => s
  .replace(/(?:^|\.?)([A-Z])/g, (_, y) => `_${y.toLowerCase()}`)
  .replace(/^_/, '')
