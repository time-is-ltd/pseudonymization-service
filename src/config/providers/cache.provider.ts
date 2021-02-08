import { ConfigCache } from '../config-cache.factory'
import { TransformMap } from '../types'

export const fromCache = <T extends TransformMap>(cache: ConfigCache<T>) => async <K extends keyof T>(key: K) => {
  if (cache.has(key)) {
    const item = cache.get(key)
    return { defaultTtl: item.ttl, v: item.v }
  }
  return
}
