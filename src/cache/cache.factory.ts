interface CacheItem<T> {
  ttl: number
  t: number
  v: T
}

export interface Cache<T> {
  has: (key: string) => boolean
  get: (key: string) => CacheItem<T>
  set: (key: string, value: T, ttl: number) => void
}

export const cacheFactory = <T>(): Cache<T> => {
  const map: Record<string, CacheItem<T>> = {}

  const checkValidity = () => {
    Object.keys(map)
      .forEach(key => {
        const item = map[key]
        if (!isValid(item)) {
          delete map[key]
        }
      })
  }

  const isValid = (item: Pick<CacheItem<T>, 't' | 'ttl'>) => {
    const { t, ttl } = item
    if (ttl === 0) {
      return true
    }

    const now = Date.now()
    const expiresAt = t + ttl * 1000
    if (expiresAt > now) {
      return true
    }
  }

  const has = (key: string): boolean => {
    const item = map[key]
    if (item) {
      return isValid(item)
    }

    return false
  }

  const get = (key: string): CacheItem<T> => {
    if (!has(key)) {
      throw new Error(`Key ${key} not found`)
    }
    return map[key]
  }

  const set = (key: string, value: T, ttl = 0) => {
    const t = Date.now()
    map[key] = {
      ttl,
      t,
      v: value
    }
  }

  // TTL ticker
  setInterval(checkValidity, 60 * 1000)

  return {
    get,
    set,
    has
  }
}
