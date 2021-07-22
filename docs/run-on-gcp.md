# Run on GCP with pre-build docker image

This document describes how to deploy the pseudonymization proxy to GCP using minimal working configuration.
The whole list of advanced configuration options is available in the [README](../README.md).

## Prerequisites

You will need the following configuration values:

### API token

Use this command to generate API token:
```shell
$ LC_CTYPE=C tr -dc A-Za-z0-9 </dev/urandom | head -c 48 ; echo ''
```

### Anonymization salt

Use this command to generate salt:
```shell
$ LC_CTYPE=C tr -dc A-Za-z0-9 </dev/urandom | head -c 32 ; echo ''
```

## 1. Create service account 
Go to https://console.cloud.google.com/iam-admin/serviceaccounts. Select a project if needed and click `Create Service Account`.

- Use `til-pseudonymization-service` as a `Service account name` name
- Click `Done`
- Select the created account from the list
- On the `Details` tab, expand `Show domain-wide delegation`
- Select `Enable Google Workspace Domain-wide Delegation`
- Click `Save`
- Now move to the `Keys` tab
- Click `Add Key` -> `Create new key` -> `JSON` -> `Create`
- Private key gets downloaded to you. Keep the file.

## 2. Authorize the service account
This will provide the service account access to the gsuite data.

Go to https://admin.google.com/

- Click `Security` panel
- Click `API controls`
- Under `Domain wide delegation`, click `Manage domain wide delegation`
- On the next page, click `Add new`.
- Set client ID. You can find the value in the downloaded private key.
- Set `OAuth scopes` to `https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/calendar.readonly`
- Click `Authorize`

## 3. Set secrets in Google Secret Manager
This part is optional. You can skip it if you prefer simply using environment vars over Google Secret Manager.

Go to https://console.cloud.google.com/security/secret-manager. For every
of the following secrets, click `Create secret`, set the `Name`, e.g. `API-TOKEN` and `Secret value`.

- `API-TOKEN` (use the generated API token)
- `ANONYMIZATION-SALT` (use the generated salt)
- `GSUITE-CLIENT-EMAIL` (use value `client_email` from the downloaded private key file)
- `GSUITE-PRIVATE-KEY` (use value `private_key` from the downloaded private key file)
- `GSUITE-SCOPES` (use `https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/calendar.readonly`)

## 4. Assign roles to the service account

This will allow our service account to read the created secrets and write to logs.

Go to https://console.cloud.google.com/iam-admin/iam

- Click `Add`
- Select your service account in `New members`
- In `Role`: 
  - Select `Secret Manager` -> `Secret Manager Secret Accessor`
  - Select `Logging` -> `Logs Writer`
- Click `Save`

Note: for security reasons, we generally recommend creating two different service accounts, one with access to gsuite data 
(used by proxy itself), one to have access to secrets (used by VM instance). To not overcomplicate things in 
this howto, we will follow with a single one.

## 5. Create VM Instance
Go to https://console.cloud.google.com/compute. Click `Create instance`. 

- Name it `til-pseudonymization-app`.
- Use at least `e2-small` machine type in `Machine configuration`
- Select `Deploy a container image to this VM instance`
- Set `Container image` to `eu.gcr.io/proxy-272310/proxy:<version>` ([list of versions](https://console.cloud.google.com/gcr/images/proxy-272310/EU/proxy?gcrImageListsize=30))
- Select `Advanced container options`
- Set the following `Environment variables` using `Add variable`:  
  - If you use Secret Manager: 
    - `HTTP_PORT` = `80`
    - `INTERNAL_DOMAIN_LIST` = comma separated list of your domains (e.g. `yourdomain.com,yourdomain.eu`)  
    - `GCP_SECRET_MANAGER_PROJECT_ID` = your project id
  - If you only use env vars:
    - `HTTP_PORT` = `80`
    - `INTERNAL_DOMAIN_LIST` = you internal domains      
    - `API_TOKEN` = your api token
    - `ANONYMIZATION_SALT` = your salt value
    - `GSUITE_CLIENT_EMAIL` = value `client_email` from the downloaded private key file
    - `GSUITE_PRIVATE_KEY` = use value `private_key` from the downloaded private key file
    - `GSUITE_SCOPES` = `https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/calendar.readonly`

Tip: on top of these, you can also set `GSUITE_TEST_USER` with value being any of your domain accounts, 
e.g. `somename@yourdomain.com`. Proxy will use it to perform a check upon its start to confirm 
it's deployed with a correct configuration. The output is then printed to stdout
and can be viewed using `View logs` action.

- Under `Firewall`, enable both `Allow HTTP traffic` and `Allow HTTPS traffic`.
- Under `Networking`, select `Network interface` -> `External IP` -> `Create IP address` and name it.
- Under `Identity and API access` -> `Service account` select your service account.
- Click `Create`

## 6. Check deployment

### 6.1 View logs

View logs using `View logs` in the context menu of your VM instance available [here](https://console.cloud.google.com/compute/instances).
You should see a report from the proxy either confirming successful deployment or providing one or more error messages, 
which might help to fix the issue.

Example report showing a successful deployment:
```
==============
RUNNING CHECKS
==============
------
CONFIG
------
• Server options are set - OK
• Can read secrets from Azure Vault - SKIPPED: Azure Key Vault not configured.
• Can read secrets from Google Secret Manager - SKIPPED: Google Secret Manager not configured.
• API token is set - OK
---
APP
---
• Healthcheck is responding - OK
• Diag is responding - OK
• Routes are registered - OK
------
GSUITE
------
• Get calendar list - OK
• Get messages list - OK

Checks total: 9, skipped: 2, failed: 0.
```

###  6.2 Test with cURL / Postman

You can also check that proxy is responding to your requests sent from tools like cURL or Postman.
To do this, replace these placeholders with real values:
- `your_IP` - IP of the instance running the pseudonymized service
- `your_email@your_company.com` - any of your GSuite email address
- `your_api_key` - your API key

### Health check
```
curl -X GET \
  https://your_IP/healthcheck \
  -H 'Cache-Control: no-cache' --insecure
```

### Google Gmail API
```
curl -X GET \
  https://your_IP/www.googleapis.com/gmail/v1/users/your_email@your_company.com/messages \
  -H 'Authorization: Bearer your_api_key' \
  -H 'Cache-Control: no-cache' --insecure