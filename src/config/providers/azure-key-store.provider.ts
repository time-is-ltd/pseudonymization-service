import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
import { toKebabCase } from '../transformers'
import { TransformMap } from '../types'

const getAzureVaultVariableName = <T extends TransformMap, K extends keyof T>(key: K): string => {
  return toKebabCase(key as string).toUpperCase()
}

export const fromAzureKeyVault = <T extends TransformMap>(vaultName: string) => {
  const vaultUrl = `https://${vaultName}.vault.azure.net`
  const credential = new DefaultAzureCredential()
  const client = new SecretClient(vaultUrl, credential)

  return async <K extends keyof T>(key: K) => {
    try {
      console.info(`[Config/Azure Key Vault]: Loading key ${key}`)
      const azureKeyVaultSecretName = getAzureVaultVariableName<T,K>(key)
      const azureKeyVaultSecret = await client.getSecret(azureKeyVaultSecretName)

      console.info(`[Config/Azure Key Vault]: ${key} loaded`)

      return { defaultTtl: 20 * 60, v: azureKeyVaultSecret.value }
    } catch (err) {
      console.error('[Config/Azure Key Vault]: ', err?.statusCode, JSON.stringify(err?.details || err, null, 2))
    }
    return
  }
}
