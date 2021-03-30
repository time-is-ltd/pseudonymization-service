# Run on Azure with pre-build docker image
## Table of contents
1. [Create resource group](#1-create-resource-group)
2. [Create App service](#2-create-app-service)
3. [Configure App service](#3-configure-app-service)
4. [Create Key vault](#4-create-key-vault)
5. [Configure Key vault](#5-configure-key-vault)
6. [Configure Key vault in the App service](#6-configure-key-vault-in-the-app-service)
7. [Test deployment with cURL](#7-test-deployment-with-curl)

## 1. Create resource group
Go to https://portal.azure.com/#create/Microsoft.ResourceGroup

- Use `til-pseudonymization-service` as a `Resource group` name
- Select `West Europe` (or your prefered region) as a `Region`
- Review all provided information and click on `Create`

## 2. Create App service
Go to https://portal.azure.com/#create/Microsoft.WebSite

### 2.1. Setup Basics
- Select `til-pseudonymization-service` in the `Resource group` field
- Use `til-pseudonymization-service-app` as an `Instance name`
- Select `Docker Container` publish option
- Select `Linux` as an `Operating System`
- Select `Europe West` (or your prefered region) as a `Region`

### 2.2. Setup Docker
- Select `Single Container` as an `Option`
- Select `Private Registry` as an `Image Source`
- Use `https://eu.gcr.io` as a `Server URL`
- Use `proxy-272310/proxy:v1.1.4` as an `Image and tag`

### 2.3. Create App service
- Review all provided information and click on `Create`

## 3. Configure App service
- Go to the `til-pseudonymization-service-app` app service overview page

### 3.1. Enable system assigned managed identity
- Select `Identity` in the left navigation bar
- Select `System assigned` tab
- Set `Status` to `On`

### 3.2. Add aplication settings
- Select `Configuration` in the left navigation bar
- Select `Application settings` tab

#### 3.2.1. Add `HTTP_PORT` application settings
- Use `80` as an application settings value

#### 3.2.2. Add `BASE_URL` application settings
- Use `URL` from the overview page (e.g. https://til-pseudonymization-service-app.azurewebsites.net) as an application settings value

#### 3.2.3. Add `INTERNAL_DOMAIN_LIST` application settings
- Use comma separeted domain list (e.g. `yourdomain.com,yourdomain.eu`) as an application settings value

### 3.3. Add health check
- Select `Health check` in the left navigation bar
- Set `Health check` to `Enable`
- Use `/healthcheck` as a path
- Set `Load balancing` to `2 minutes`

## 4. Create Key vault
Go to https://portal.azure.com/#create/Microsoft.KeyVault

### 4.1. Setup Basics
- Select `til-pseudonymization-service` in the `Resource group` field
- Use `til-kv` as a `Key vault name`
- Select `West Europe` (or your prefered region) as a `Region`

### 4.2. Setup Access policy
- Set `Permission model` to `Vault access policy`

#### 4.2.1 Add access Policy
- Click on `Add Access Policy`
- Select `Get` secret management operation in the `Secret permissions` selectbox
- Select `til-pseudonymization-service-app` as a `principal`
- Click on `Add`

### 4.3. Review and create key vault
- Review all provided information and click on `Create` 

## 5. Configure Key vault
- Go to `til-kv` key vault overview page

### 5.1. Add Secrets
- Select `Secrets` in the left navigation bar

#### 5.1.1. Create `ANONYMIZATION-SALT` secret
Generate random string and use it as a `ANONYMIZATION-SALT` secret value
```shell
$ LC_CTYPE=C tr -dc A-Za-z0-9 </dev/urandom | head -c 32 ; echo ''
```

#### 5.1.2. Create `API-TOKEN` secret
Generate random string and use it as a `API-TOKEN` secret value
```shell
$ LC_CTYPE=C tr -dc A-Za-z0-9 </dev/urandom | head -c 48 ; echo ''
```

#### Optional: 5.1.3. Create `RSA-PRIVATE-KEY` and `RSA-PUBLIC-KEY` secrets
Use [src/helpers/genKey.js](../src/helpers/genKey.js) utility to generate Private and Public key pair.

```shell
$ node src/helpers/genKey.js
```

Use generated key pair as `RSA-PRIVATE-KEY` and `RSA-PUBLIC-KEY` secret values respectively

#### Optional: 5.1.4. Enable Google Workspace
- Get [Google Workspace credentials](how-it-works.md#how-to-get-google-api-credentials)
- Create secret named `GSUITE-CLIENT-EMAIL` and use `client_email` from generated `credentials.json` as a secret value
- Create secret named `GSUITE-PRIVATE-KEY` and use `private_key` from generated `credentials.json` as a secret value
- Create secret named `GSUITE-SCOPES` and use `https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/calendar.readonly` as a secret value

#### Optional: 5.1.5. Enable Office 365
- Get [Office 365 app credentials](./how-to-get-office-365-app-credentials.md)
- Set [API application permissions](./set-office-365-api-application-permissions.md) OR [API delegated permissions](./set-office-365-api-delegated-permissions.md)
- Create secret named `O365-TENANT-ID` and use `Directory (tenant) ID` from the [app registration overview page](./how-to-get-office-365-app-credentials.md#2-get-tenant-id-and-client-id) as a secret value
- Create secret named `O365-CLIENT-ID` and use `Application (client) ID` from the [app registration overview page](./how-to-get-office-365-app-credentials.md#2-get-tenant-id-and-client-id) as a secret value
- Create secret named `O365-CLIENT-SECRET` and use [generated client secret](./how-to-get-office-365-app-credentials.md#3-get-client-secret) as a secret value
- Optional (for delegated access only): Create secret named `O365-REFRESH-TOKEN` and use [refresh tolken](./set-office-365-api-delegated-permissions.md#3-4-show-refresh-token) as a secret value

## 6. Configure Key vault in the App service
- Go to `til-pseudonymization-service-app` app service overview page

### 6.1. Add aplication settings
- Select `Configuration` in the left navigation bar
- Select `Application settings` tab

#### 6.1.1. Add `AZURE_KEY_VAULT_NAME` application settings
- Use `til-kv` as an application settings value

#### 7. Test deployment with cURL
- test [Health check](../README.md#health-check)
- test [Google Gmail API](../README.md#google-gmail-api)
- test [Microsoft Graph API](../README.md#microsoft-Graph-api)