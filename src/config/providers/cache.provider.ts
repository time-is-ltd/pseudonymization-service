import { Cache } from '../../cache'
import { TransformMap } from '../types'
import { logger, VerboseLevel } from '../../logger'

export const fromCache = <T extends TransformMap> (cache: Cache<T>) => async <K extends keyof T> (key: K) => {
  logger(VerboseLevel.V, `[Config/Cache]: Loading key ${key}`)
  if (cache.has(key as string)) {
    const item = cache.get(key as string)
    if (item) {
      logger(VerboseLevel.V, `[Config/Cache]: ${key} loaded`)
    }
    return { defaultTtl: item.ttl, v: item.v }
  }
}
