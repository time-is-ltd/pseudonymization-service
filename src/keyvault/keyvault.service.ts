import { DefaultAzureCredential } from "@azure/identity"
import { SecretClient } from "@azure/keyvault-secrets"
import config from '../config'

const keyVaultName: string | undefined = config.azureKeyVaultName
const KVUri: string | undefined = "https://" + config.azureKeyVaultName + ".vault.azure.net";

// TODO: This should be in the KeyVaultService
/*
const apiToken: string | undefined = process.env.API_TOKEN
const anonymizationSalt: string | undefined = process.env.ANONYMIZATION_SALT
const rsaPrivateKey: string = toPem(process.env.RSA_PRIVATE_KEY)
*/

const getKeyVaultClient = (keyVaultName: string) => {

      const credential = new DefaultAzureCredential();
      const client = new SecretClient(KVUri, credential);
      return client
}

export const getSecret = async (secretName: string): Promise<string> => {

  try{
    if(process.env[secretName] === undefined){
      const client = getKeyVaultClient(keyVaultName)
      const result = await client.getSecret(secretName)
      return result.value
    } else return process.env[secretName]
  } catch(err){ return err}
  
}
