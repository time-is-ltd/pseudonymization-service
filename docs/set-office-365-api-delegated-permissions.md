# Set API delegated permissions
## Table of contents
1. [Configure permissions](#1-configure-permissions)
2. [Restrict application access to specific members](#optional-2-restrict-application-access-to-specific-members)

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

## Optional: 2. Restrict application access to specific members
## 2.1. Connect Exchange Online as an administrator via PowerShell
```powershell
Install-Module ExchangeOnlineManagement -Force
```

```powershell
Connect-ExchangeOnline
```

## 2.2. Create service account
```powershell
New-Mailbox -Name "tilServiceAccount" -DisplayName "TIL service account" -microsoftOnlineServiceId 
```

## 2.2. Create new security group
```powershell
New-DistributionGroup -Name "TIL pseudonymization service access group" -Alias TILPseudonymizationServiceRestrictAccess -Type Security
```

## 2.3. Add members to the newly created security group
```powershell
Add-DistributionGroupMember -Identity "TIL pseudonymization service access group" -Member username@domain.com
```
The command must be run for every member that will be accessed by the pseudonymization service

## 2.4. Connect to the Azure Active Directory
```powershell
Install-Module AzureAD -Force
```

```powershell
Connect-AzureAD
```

## 2.5. Create new application access policy for user scoping
```powershell
New-ApplicationAccessPolicy -AccessRight RestrictAccess -AppId {Application (client) ID} -PolicyScopeGroupId "TIL pseudonymization service access group"
```
