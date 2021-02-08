import { TransformMap, Response, Provider, ProviderResult } from './types'
import { configCacheFactory } from './config-cache.factory'
import { fromAzureKeyVault, fromCache, fromEnvVariable } from './providers'

export const configFactory = <T extends TransformMap>(mapperMap: T, vaultKeysAllowlist: Array<keyof T> = []) => {
  const cache = configCacheFactory<T>()

  const get = async <K extends keyof T>(key: K): Promise<Response<T, K>> => {
    const functionOrObj = mapperMap[key as string]
    const mapperItemObj = typeof functionOrObj === 'function'
      ? { transform: functionOrObj }
      : functionOrObj

    const { transform } = mapperItemObj

    if (!transform) {
      throw new Error('No transformer found')
    }

    const isVaultEnabled = <T extends TransformMap, K extends keyof T>(key: K, name?: string) => {
      return name?.length > 0 && vaultKeysAllowlist.indexOf(key as string) > -1
    }

    const compose = (...fns: Array<Provider<T, K>>) => async (x: K): Promise<ProviderResult<string>> => {
      const isObject = (o: unknown): o is ProviderResult => {
        return o === Object(o)
      } 
      for (const fn of fns) {
        const result = await fn(x)
        if (result != null) {
          if (isObject(result)) {
            return { ...result, v: String(result.v) }
          }
          return { v: String(result) }
        }
      }

      return { v: undefined }
    }

    const azureKeyVaultName = process.env.AZURE_KEY_VAULT_NAME
    const { defaultTtl = 0, v: value } = await compose(
      fromCache<T>(cache),
      fromEnvVariable<T>(),
      fromAzureKeyVault<T>(isVaultEnabled<T, K>(key, azureKeyVaultName), azureKeyVaultName)
    )(key)

    const { ttl = defaultTtl } = mapperItemObj
    const transformedValue = transform(value)

    // Always set to prolong the ttl, if variable in use
    cache.set(key, transformedValue, ttl)

    return transformedValue
  }

  return Object.keys(mapperMap)
    .reduce((obj, key) => {
      Object.defineProperty(obj, key, {
        get: () => get(key)
      })
      return obj
    }, {}) as {
      [K in keyof T]: Promise<Response<T, K>>
    }
}
