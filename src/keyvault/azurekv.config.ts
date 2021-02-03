import { DefaultAzureCredential } from "@azure/identity"
import { SecretClient } from "@azure/keyvault-secrets"

// Env variables
export const keyVaultName: string | undefined = process.env.AZURE_KEY_VAULT_NAME
export const KVUri: string | undefined = "https://" + keyVaultName + ".vault.azure.net";


// export const credential = new DefaultAzureCredential();
// export const client = new SecretClient(KVUri, credential);

// TODO
/*
IF AZURE_KEY_VAULT_NAME is defined:
azurekv.config.ts - setup configuration
azurekv.service.ts - use config to create clients and export the keyVault method
*/


// GCP
/*
export const clientEmail: string | undefined = process.env.GSUITE_CLIENT_EMAIL
export const privateKey: string = toPem(process.env.GSUITE_PRIVATE_KEY || '')
export const scopes: string[] = toArray(process.env.GSUITE_SCOPES)
*/

// MS
/*
export const tenantId: string | undefined = process.env.O365_TENANT_ID 
export const clientId: string | undefined = process.env.O365_CLIENT_ID 
export const clientSecret: string | undefined = process.env.O365_CLIENT_SECRET 
*/