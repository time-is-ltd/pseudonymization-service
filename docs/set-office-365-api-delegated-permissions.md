# Set API delegated permissions
## Table of contents
1. [Configure permissions](#1-configure-permissions)
2. [Create service account](#2-create-service-account)
3. [Get Refresh token](#3-get-refresh-token)

## 1. Configure permissions
Go to the `til-pseudonymization-service-app-registration` app registration overview page

- Select `API permissions` in the left navigation bar
- Remove `User.Read` permission
- Click on `Add a permission`
- Select `Microsoft Graph` under the `Microsoft APIs` tab
- Select `Application permissions`
- Select `Calendars.Read.Shared` and `Mail.Read.Shared` in the `Select permissions` section
- Review all provided information and click on `Add permission`
- Click on `Grant admin consent for {Your tenant name}` and confirm modal dialog by clicking on `Yes`

## 2. Create service account
## 2.1. Connect Exchange Online as an administrator via PowerShell
```powershell
Install-Module ExchangeOnlineManagement -Force
```

```powershell
Connect-ExchangeOnline
```

## 2.2. Create service account mailbox
```powershell
New-Mailbox -Name "tilServiceAccount" -DisplayName "TIL service account" -microsoftOnlineServiceId your_service_account@your_company.com -Password (ConvertTo-SecureString -String 'your_password' -AsPainText -Force) -ResetPasswordOnNextLogon $false
```

- `your_service_account@your_company.com` newly created mailbox, that will be used as a service account
- `your_password` password by your password policy

## 2.2. Add fullaccess (mailbox, calendar) permission to the service account
```powershell
Add-MailboxPermission -Identity "your_email@your_company.com" -User "your_service_account@your_company.com" -AccessRights FullAccess
```
- `your_service_account@your_company.com` newly created service account mailbox
- `your_email@your_company.com` members email address
- The command must be run for every member that will be accessed by the pseudonymization service

## 3. Get Refresh token
### 3.1. Install partner center module via PowerShell as administrator
```powershell
Install-Module PartnerCenter -Force
```

### 3.2. Get access token and save it to $response variable
```powershell
$response = New-PartnerAccessToken -ApplicationId your_application_id -Scopes 'https://graph.microsoft.com/.default' -Tenant your_tenant_id -UseDeviceAuthentication
```
- `your_application_id` Application (client) ID from the [app registration overview page](./how-to-get-office-365-app-credentials.md#2-get-tenant-id-and-client-id)
- `your_tenant_id` Directory (tenant) ID from the [app registration overview page](./how-to-get-office-365-app-credentials.md#2-get-tenant-id-and-client-id)

### 3.3. Sign in in the browser
To sign in use a web browser to open the page https://microsoft.com/devicelogin and enter the code what you will see in PowerShell console to authenticate. Log in with newly created service account.

### 3.4. Show refresh token
```powershell
$response.RefreshToken
```