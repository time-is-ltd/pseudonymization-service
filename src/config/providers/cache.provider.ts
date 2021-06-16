import { Cache } from '../../cache'
import { TransformMap } from '../types'

export const fromCache = <T extends TransformMap>(cache: Cache<T>) => async <K extends keyof T>(key: K) => {
  if (cache.has(key as string)) {
    const item = cache.get(key as string)
    return { defaultTtl: item.ttl, v: item.v }
  }
}
