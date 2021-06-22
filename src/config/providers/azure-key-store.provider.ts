import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
import { toKebabCase } from '../transformers'
import { TransformMap } from '../types'
import { logger, VerboseLevel } from '../../logger'

const getAzureVaultVariableName = <T extends TransformMap, K extends keyof T> (key: K): string => {
  return toKebabCase(key as string).toUpperCase()
}

export const fromAzureKeyVault = <T extends TransformMap> (vaultName: string) => {
  const vaultUrl = `https://${vaultName}.vault.azure.net`
  const credential = new DefaultAzureCredential()
  const client = new SecretClient(vaultUrl, credential)

  return async <K extends keyof T> (key: K) => {
    try {
      const azureKeyVaultSecretName = getAzureVaultVariableName<T, K>(key)
      const azureKeyVaultSecret = await client.getSecret(azureKeyVaultSecretName)

      logger(VerboseLevel.V, `[Config/Azure Key Vault]: ${key} loaded`)

      return { defaultTtl: 20 * 60, v: azureKeyVaultSecret.value }
    } catch (err) {
      logger(VerboseLevel.V, `[Config/Azure Key Vault]: ${key} error`, err?.statusCode, err?.details || err)
    }
    return
  }
}
