import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
import { toKebabCase } from '../transformers'
import { TransformMap } from '../types'

const getAzureVaultVariableName = <T extends TransformMap, K extends keyof T>(key: K): string => {
  return toKebabCase(key as string).toUpperCase()
}

export const fromAzureKeyVault = <T extends TransformMap>(enabled: boolean, vaultName?: string) => async <K extends keyof T>(key: K) => {
  if (enabled && vaultName) {
    try {
      const azureKeyVaultUri = `https://${vaultName}.vault.azure.net`
      const azureCredential = new DefaultAzureCredential()
      const azureSecretClient = new SecretClient(azureKeyVaultUri, azureCredential)

      const azureKeyVaultSecretName = getAzureVaultVariableName<T,K>(key)
      const azureKeyVaultSecret = await azureSecretClient.getSecret(azureKeyVaultSecretName)

      return { defaultTtl: 20 * 60, v: azureKeyVaultSecret.value }
    } catch (err) { }
  }
  return
}
