import { logger } from '../../logger'
import { Cache } from '../../cache'
import { TransformMap } from '../types'

export const fromCache = <T extends TransformMap>(cache: Cache<T>) => async <K extends keyof T>(key: K) => {
  logger('verbose', `[Config/Cache]: Loading key ${key}`)
  if (cache.has(key as string)) {
    const item = cache.get(key as string)

    if (item) {
      logger('verbose', `[Config/Cache]: ${key} loaded`)
    }

    return { defaultTtl: item.ttl, v: item.v }
  }
}
