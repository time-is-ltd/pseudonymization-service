# Run on Google Cloud Run with pre-build docker image

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

## 1. Enable Gmail API & Calendar API

- Log into GCP Cloud Console. Select or create a project if needed.
- In Cloud Console, go to [API Library - Gmail](https://console.cloud.google.com/apis/library/gmail.googleapis.com) 
  - Check that Gmail API is enabled, if not, click `Enable`
- In Cloud Console, go to [API Library - Calendar](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com)
  - Check that Calendar API is enabled, if not, click `Enable`  

## 2. Create service account 
Go to https://console.cloud.google.com/iam-admin/serviceaccounts. Click `Create Service Account`.

- Use `til-pseudonymization-service` as a `Service account name` name
- Click `Done`
- Select the created account from the list
- On the `Details` tab, expand `Show domain-wide delegation`
- Select `Enable Google Workspace Domain-wide Delegation`
- Click `Save`
- Now move to the `Keys` tab
- Click `Add Key` -> `Create new key` -> `JSON` -> `Create`
- Private key gets downloaded to you. Keep the file.

## 3. Authorize the service account
This will provide the service account access to the gsuite data.

Go to https://admin.google.com/

- Click `Security` panel
- Click `API controls`
- Under `Domain wide delegation`, click `Manage domain wide delegation`
- On the next page, click `Add new`.
- Set client ID. You can find the value in the downloaded private key.
- Set `OAuth scopes` to `https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/calendar.readonly`
- Click `Authorize`

## 4. Set secrets in Google Secret Manager
Go to https://console.cloud.google.com/security/secret-manager. 

For every of the following secrets, click `Create secret`, set the `Name`, e.g. `api-token` and `Secret value`.

- `api-token` (use the generated API token)
- `anonymization-salt` (use the generated salt)
- `gsuite-client-email` (use value `client_email` from the downloaded private key file - without the outer quotation marks)
- `gsuite-private-key` (use value `private_key` from the downloaded private key file - without the outer quotation marks)

## 5. Assign roles to the service account

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

## 6. Create Cloud Run instance
Go to https://console.cloud.google.com/run. Click `Create service`. 

- Select `Deploy one revision from an existing container image`
  - Set `Container image URL` to `eu.gcr.io/proxy-272310/proxy:<version>` ([list of versions](https://console.cloud.google.com/gcr/images/proxy-272310/EU/proxy?gcrImageListsize=30))
- Set `Container port` to `80`
- Set `Service name` to `til-pseudonymization-app`.
- Set `Region` to one of `us-central1` or `europe-west-1` (based on location).
  
  
### CPU allocation and pricing
- Select `CPU is only allocated during request processing`

### Autoscaling
- Set `Minimum number of instances` to `0`
- Set `Maximum number of instances` to `10`

### Ingress
- Select `Allow all traffic`

### Authentication
- Select `Allow unauthenticated invocations`

## CONTAINER
### Capacity
- Set `Memory` to `1 GiB`
- Set `CPU` to `2`
- Set `Request timeout` to `300`
- Set `Maximum requests per container` to `10`


## SECURITY
- Set `Service account` created in step 5).

## VARIABLES & SECRETS
- Set the following `Environment variables` using `Add variable`:  
    - `HTTP_PORT` = `80`
    - `INTERNAL_DOMAIN_LIST` = you internal domains
    - `GSUITE_SCOPES` = `https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/calendar.readonly`


Tip: on top of these, you can also set `GSUITE_TEST_USER` with value being any of your domain accounts, 
e.g. `somename@yourdomain.com`. Pseudonymization service will use it to perform a check upon its start to confirm 
it's deployed with a correct configuration. The output is then printed to stdout
and can be viewed in `Logs` panel.
    
- Set the following `Secrets` using `Reference a secret (Exposed as environment variable)`
    - Secret: `api-token` -> Environment: `API_TOKEN` 
    - Secret: `anonymization-salt` ->  Environment: `ANONYMIZATION_SALT` 
    - Secret: `gsuite-client-email` ->  Environment: `GSUITE_CLIENT_EMAIL` 
    - Secret: `gsuite-private-key` ->  Environment: `GSUITE_PRIVATE_KEY`
    
- Click `Create`

## 7. Check deployment

### 7.1 View logs

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

###  7.2 Test with cURL / Postman

You can also check that proxy is responding to your requests sent from tools like cURL or Postman.
To do this, replace these placeholders with real values:
- `your_url` - URL address of the instance in Cloud Run
- `your_email@your_company.com` - any of your GSuite email address
- `your_api_key` - your API key

### Health check
```
curl -X GET https://your_url/healthcheck
```

### Google Gmail API
```
curl -X GET https://your_url/www.googleapis.com/gmail/v1/users/your_email@your_company.com/messages \
  -H 'Authorization: Bearer your_api_key'
```  

## 8. Let us know

Please contact your account manager and provide him:
- The API key
- Cloud Run URL address

