export const matchAll = (regExp: RegExp, str = '') => {
  const iterator = str.matchAll(regExp)
  return Array.from(iterator)
}
