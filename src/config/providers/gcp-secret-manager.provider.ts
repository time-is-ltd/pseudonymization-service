import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { toKebabCase } from '../transformers'
import { TransformMap } from '../types'

const getGcpSecretVariableName = <T extends TransformMap, K extends keyof T>(key: K, prefix = ''): string => {
  const name =  toKebabCase(key as string).toUpperCase()
  const normalizedPrefix = prefix.toUpperCase()

  return prefix
    ? `${normalizedPrefix}-${name}`
    : name
}

const client = new SecretManagerServiceClient()

export const fromGcpSecretManager = <T extends TransformMap>(enabled: boolean, projectId?: string, prefix?: string) => async <K extends keyof T>(key: K) => {
  if (enabled && projectId) {
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
  return
}
