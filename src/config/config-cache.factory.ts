import { TransformMap, Response } from './types'

interface CacheItem {
  ttl: number
  t: number
  v: unknown
}

export interface ConfigCache<T extends TransformMap> {
  has<K extends keyof T>(key: K): boolean
  get<K extends keyof T>(key: K): CacheItem
  set<K extends keyof T>(key: K, value: Response<T, K>, ttl: number): void
}

export const configCacheFactory = <T extends TransformMap>(): ConfigCache<T> => {
  const map: Record<string, CacheItem> = {}

  const checkValidity = () => {
    Object.keys(map)
      .forEach(key => {
        const item = map[key]
        if (!isValid(item)) {
          delete map[key]
        }
      })
  }

  const isValid = (item: Pick<CacheItem, 't' | 'ttl'>) => {
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

  const has = <K extends keyof T>(key: K): boolean => {
    const item = map[key as string]
    if (item) {
      return isValid(item)
    }

    return false
  }

  const get = <K extends keyof T>(key: K) => {
    if (!has(key)) {
      throw new Error(`Key ${key} not found`)
    }
    return map[key as string]
  }

  const set = <K extends keyof T>(key: K, value: Response<T, K>, ttl = 0) => {
    const t = Date.now()
    map[key as string] = {
      ttl,
      t,
      v: value
    }
  }

  // TTL ticker
  setInterval(() => checkValidity(), 2 * 60 * 1000)

  return {
    get,
    set,
    has
  }
}
