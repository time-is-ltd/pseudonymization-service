export const cacheFactory = () => {
  const has = (key: string) => false
  const get = (key: string) => { throw new Error(`Key ${key} not found`) }
  const set = (key: string, value: unknown) => {}

  return {
    get,
    set,
    has
  }
}
