import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { toKebabCase } from '../transformers'
import { TransformMap } from '../types'

const getGcpSecretVariableName = <T extends TransformMap, K extends keyof T>(key: K, prefix: string): string => {
  const name = toKebabCase(key as string).toUpperCase()
  const normalizedPrefix = prefix.toUpperCase()

  return prefix.length > 0
    ? `${normalizedPrefix}-${name}`
    : name
}

export const fromGcpSecretManager = <T extends TransformMap>(projectId: string, prefix = '') => {
  const client = new SecretManagerServiceClient()

  return async <K extends keyof T>(key: K) => {
    try {
      const secretName = getGcpSecretVariableName(key as string, prefix)
      const name = `projects/${projectId}/secrets/${secretName}/versions/latest`
      const [secretVersion] = await client.accessSecretVersion({
        name
      })

      const value = secretVersion.payload.data.toString()

      return { defaultTtl: 20 * 60, v: value }
    } catch (err) { }
  }
}
