[![Build & Test](https://github.com/time-is-ltd/pseudonymization-service/actions/workflows/node.js.yml/badge.svg)](https://github.com/time-is-ltd/pseudonymization-service/actions/workflows/node.js.yml)
# Pseudonymization Service for Google Workspace and Microsoft Graph APIs 

**Created and Open-sourced by [Time is Ltd.](https://www.timeisltd.com)**

A backend service to anonymize Google Workspace and Microsoft Graph API response objects.
Removing all sensitive and private textual and personal information from the objects returned by the APIs.

## Quick start
- Getting started
  - [How it works](./docs/how-it-works.md)
  - [Supported endpoints](./docs/endpoints.md)
    - [Microsoft Graph Api](./docs/endpoints.md#microsoft-graph-api)
    -  Google APIs
       - [Calendar API](./docs/endpoints.md#google-calendar-api)
       - [Gmail API](./docs/endpoints.md#google-gmail-api)

- Usage
  - [Installation](#installation)
    - [run on GCP in 2 minutes with pre-build docker image](#run-on-gcp-2-minutes)
    - [run on Azure with pre-build docker image](./docs/run-on-azure.md)
    - [run locally from source](#run-locally)
    - [run using docker](#run-using-docker)
    - [run using docker-compose](#run-using-docker-compose)
  - [Configure](#configuration)
    - get your [Google API credentials](./docs/how-it-works.md#how-to-get-google-api-credentials) / [O365 credentials](./docs/how-it-works.md#how-to-get-office-365-credentials)
    - edit [enviromental variables and vault secrets](#configuration)
  - [Test deployment with cURL](#test-deployment-with-curl)

## Installation

### Run on GCP (2 minutes)
1. Create new GCP instance based on the latest available docker image `eu.gcr.io/proxy-272310/proxy:<version>` ([list of available versions](https://console.cloud.google.com/gcr/images/proxy-272310/EU/proxy?gcrImageListsize=30)), see [how to do it in GCP](https://cloud.google.com/compute/docs/instances/create-start-instance#from-container-image)

2. Add/edit enviromental variables in the GCP instance editor UI

3. Start and [test your instance with cURL](#test-deployment-with-curl)

### Run locally
#### Prerequisites
- [Node](https://nodejs.org)
  - Install Node JS (can be run on Linux, Windows or Mac)
- [Git](https://www.git-scm.com/)
  - Download git from https://www.git-scm.com/

1. Clone repository
```shell
$ git clone https://github.com/time-is-ltd/pseudonymization-service.git
$ cd pseudonymization-service
```

2. Install npm packages
```shell
$ npm i
```

3. Create and edit [.env](#configuration) file
```shell
$ cp .env.example .env
$ vi .env
```

4. [Optional: enable SSL](#ssl)

5. Optional: Run tests
```shell
$ npm run test
```

6. Run service
```shell
$ npm start
```

### Run using docker
#### Prerequisites
- [Docker](https://www.docker.com)
  - Download Docker from https://www.docker.com (can be run on Linux, Windows or Mac)

Use the latest docker image from the GCP docker repository

1. ```docker pull eu.gcr.io/proxy-272310/proxy:<version>``` ([list of available versions](https://console.cloud.google.com/gcr/images/proxy-272310/EU/proxy?gcrImageListsize=30))

2. Create and edit file with [enviromental variables](#configuration)
```shell
$ cp .env.example .env
$ vi .env
```

3. Optional: [enable SSL](#ssl)

4. Run docker image (substitute `<version>` for your version)
```shell
$ docker run --env-file .env eu.gcr.io/proxy-272310/proxy:<version>
```

### Run using docker-compose
- [Git](https://www.git-scm.com)
  - Download git from https://www.git-scm.com
- [Docker](https://www.docker.com)
  - Download Docker from https://www.docker.com (can be run on Linux, Windows or Mac)
- [Docker Compose](https://docs.docker.com/compose)
  - Install Compose on Linux systems https://docs.docker.com/compose/install/#install-compose-on-linux-systems

1. Clone repository
```shell
$ git clone https://github.com/time-is-ltd/pseudonymization-service.git
$ cd pseudonymization-service
```

2. Create and edit file with [enviromental variables](#configuration)
```shell
$ cp .env.example .env
$ vi .env
```

3. [Optional: enable SSL](#ssl)

4. Build image
```shell
$ docker-compose build
```

5. Run image
```shell
$ docker-compose up
```


## SSL
1. Get SSL certificate from [certification authority](https://letsencrypt.org/) or create self signed certificate
```bash
$ openssl req -nodes -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 3650
```

`OpenSSL` script will generate `key.pem` file with private key and `cert.pem` file with certificate.

2. Convert private key file (`key.pem`) to one-line PEM format
```bash
$ awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' key.pem
```

1. Use printed value as [`SSL_KEY` enviromental variable or `SSL-KEY` vault secret](#configuration)

2. Convert certificate file (`cert.pem`) to one-line PEM format
```bash
$ awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' cert.pem
```

1. Use printed value as [`SSL_CERT` enviromental variable or `SSL-CERT` vault secret](#configuration)

## Configuration

There are 3 ways to provide config values
- using enviromental variables
- using Azure Key Vault (You have to provide `AZURE_KEY_VAULT_NAME` enviromental variable in order to enable Azure Key Vault)
- using Google Secret Manager (You have to provide `GCP_SECRET_MANAGER_PROJECT_ID` enviromental variable in order to enable Google Secret Manager)

| Enviromental Variable<br />*name*   | Key Vault/Secret Manager<br />*secret name* | Value         | Description | Example                               | 
| ----------------------------------- | ------------------------------------------- | --------------------------------- | ------------- | -------------------------------------
| `API_TOKEN`                         | `API-TOKEN`                                 | string        | Authorization api token (must be at least 32 characters long) | 76xmfSGx26wmj4ty8UuGGDMhrPkwNkjk |
| `ANONYMIZATION_SALT`                | `ANONYMIZATION-SALT`                        | string        | Salt that is used in data anonymization. Should be at least 32 characters long | yvUCixgSV6EMcE2FpZispWkju8N3LrWp
| `BASE_URL`                          | `N/A`                                       | string               | Pseudonymization service base url | http://localhost       |               
| `HTTP_PORT`                         | `N/A`                                       | number               | Optional. Http listening port. You should set at least one of `HTTP_PORT` or `HTTPS_PORT` env variables, otherwise the service will not listen on any port | 80
| `HTTPS_PORT`                        | `N/A`                                       | number               | Optional. Https listening port. You have to provide `SSL_KEY` and `SSL_CERT` secrets | 443
| `VERBOSITY`                         | `N/A`                                       | number (default 0) | Optional. Set verbosity level for stdout output (0, 1, 2). | 0
| `INTERNAL_DOMAIN_LIST`              | `N/A`                                       | comma separated list | Optional. List of internal domains | yourdomain.com,yourdomain.eu
| `ANONYMIZE_EXTERNAL_EMAIL_DOMAIN`   | `N/A`                                       | boolean (default true) | Optional. Anononymize external domain in emails | true
| `ANONYMIZE_EXTERNAL_EMAIL_USERNAME` | `N/A`                                       | boolean (default true) | Optional. Anononymize external username in emails              | true
| `ANONYMIZE_INTERNAL_EMAIL_DOMAIN`   | `N/A`                                       | boolean (default false) | Optional. Anononymize internal domain in emails | false
| `ANONYMIZE_INTERNAL_EMAIL_USERNAME` | `N/A`                                       | boolean (default true) | Optional. Anononymize internal username in emails | true
| `AZURE_KEY_VAULT_NAME`              | `N/A`                                       | string               | Optional. Set only if you want to use Azure Key Vault. Your Azure Key Vault name | test-kv 
| `GCP_SECRET_MANAGER_PROJECT_ID`     | `N/A`                                       | string               | Optional. Set only if you want to use Google Secret Manager. GCP project id for which to manage secrets | test-project
| `GCP_SECRET_MANAGER_PREFIX`         | `N/A`                                       | string               | Optional. Set only if you want to use Google Secret Manager. This option allows you to prefix secret names with a string value. (e.g. if you set prefix to `test`, `API-TOKEN` will become `TEST-API-TOKEN`) | test
| `SSL_KEY`                           | `SSL-KEY`                                   | string        | Optional. Converted file with private key (`key.pem`) to one-line PEM format. Follow [SSL guide](#ssl) to get SSL PEM files.
| `SSL_CERT`                          | `SSL-CERT`                                  | string        | Optional. Converted file with certificate (`cert.pem`) to one-line PEM format. Follow [SSL guide](#ssl) to get SSL PEM files.
| `RSA_PRIVATE_KEY`                   | `RSA-PRIVATE-KEY`                           | string        | Optional. Converted file with RSA Private Key to one-line PEM format. Use the [src/helpers/genKey.js](./src/helpers/genKey.js) to generate it. Necessary for full pseudonimization case only.
| `RSA_PUBLIC_KEY`                   | `RSA-PUBLIC-KEY`                             | string        | Optional. Necessary for full pseudonimization case only.
| `GSUITE_CLIENT_EMAIL`               | `GSUITE-CLIENT-EMAIL`                       | string        | Optional. Value of `client_email` property located in google service account credentials.json file. You can get google service account credentials via [How to get Google api credentials guide](./docs/how-it-works.md#how-to-get-google-api-credentials).
| `GSUITE_PRIVATE_KEY`                | `GSUITE-PRIVATE-KEY`                        | string        | Optional. Value of `private_key` property located in google service account credentials.json file. You can get google service account credentials via [How to get Google api credentials guide](./docs/how-it-works.md#how-to-get-google-api-credentials).
| `GSUITE_SCOPES`                     | `GSUITE-SCOPES`                             | string        | https://www.googleapis.com/auth/gmail.readonly, https://www.googleapis.com/auth/calendar.readonly |               | OAuth 2.0 Scopes for Google APIs
| `O365_TENANT_ID`                    | `O365-TENANT-ID`                            | string        | Optional. Office 365 tenant ID. You can get tenant ID via [How to get Office 365 credentials guide](./docs/how-it-works.md#how-to-get-office-365-credentials) | 00000000-0000-0000-0000-000000000000 
| `O365_CLIENT_ID`                    | `O365-CLIENT-ID`                            | string        | Optional. Office 365 client ID. You can get client ID via [How to get Office 365 credentials guide](./docs/how-it-works.md#how-to-get-office-365-credentials) | 00000000-0000-0000-0000-000000000000 
| `O365_CLIENT_SECRET`                | `O365-CLIENT-SECRET`                        | string        | Optional. Office 365 client secret. You can get client secret via [How to get Office 365 credentials guide](./docs/how-it-works.md#how-to-get-office-365-credentials)

### Verbosity levels
- 0 (default): prints registered routes
- 1: prints request headers in Apache Common Log format + list of loaded configuration keys
- 2: prints whole request and response including bodies

All logging always goes to stdout only. 

## Test deployment with cURL
Get pseudonymized email messages response from the pseudonymized service with cURL
- `your_IP` is the IP of the instance running the pseudonymized service
- `your_email@your_company.com` your Google Workspace email address
- `your_api_key` is your API key (to clarify, the API key is your generated key - string, at least 32 chars)

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
```

### Microsoft Graph API
```
curl -X GET \
  https://your_IP/graph.microsoft.com/v1.0/users/your_email@your_company.com/messages \
  -H 'Authorization: Bearer your_api_key' \
  -H 'Cache-Control: no-cache' --insecure
```

## Future improvements
1. Implement [OAuth 2.0 Client Credentials Grant Type](https://tools.ietf.org/html/rfc6749#section-4.4) to receive Bearer jwt authorization token and use it instead of `API_TOKEN`


## MIT License

Copyright (c) 2020 Time is Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.