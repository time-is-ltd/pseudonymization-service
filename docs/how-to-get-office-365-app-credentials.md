# How to get Office 365 app credentials
## Table of contents
1. [Create App registration](#1-create-app-registration)
2. [Get `tenant ID` and `client ID`](#2-get-tenant-id-and-client-id)
3. [Get `client secret`](#3-get-client-secret)

## 1. Create App registration
Go to https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps

- Click on `New Registration`
- Use `til-pseudonymization-service-app-registration` as an `Name`
- Select `Accounts in this organizational directory only (Single tenant)` OR `Accounts in any organizational directory (Any Azure AD directory - Multitenant)` as a `Supported account types` field
- Review all provided information and click on `Register`

## 2. Get `tenant ID` and `client ID`
Go to the `til-pseudonymization-service-app-registration` app registration overview page

- You can see all needed information (`Directory (tenant) ID`, `Application (client) ID`) under the Essentials section

## 3. Get `client secret`
Go to the `til-pseudonymization-service-app-registration` app registration overview page

- Select `Certificates & secrets` in the left navigation bar
- Click on `New client secret`
- Use `TIL pseudonymization service app registraction client secret` as a `Description`
- Select `In 1 year` as an `Expires`
- Review all provided information and click on `Add`

- You will see newly created client secret under the `Client secrets` section
- Click on `Copy to clipboard` icon next to the client secret value
- **Copy generated Value to a save place, because you will see it only ones!**
