# Anonymization Service by Time is Ltd.

## Description
A backend service that anonymizes google G Suite and Microsoft O365 API response objects.

### quick start
Read [how it works](#how-it-works)

#### Install
  - [run on GCP / Azure in 2 minutes with pre-build docker image](#run-on-gcp-2-minutes)
  - [run locally from source](#run-locally)
  - [run pre-build container localy](#run-from-docker-container)
  - [run using docker-compose](#run-using-docker-compose)

#### Configure
  - get your [G Suite credentials](#how-to-get-google-api-credentials) / [O365 credential](#how-to-get-office-365-credentials)
  - edit [enviromental variables and secrets](#enviromental-variables)

#### Test
  - [use cURL to get anonymized data](#test-with-curl)

## How it works
### Authorization
Every request to the anonymization service must be authorized by [bearer token in an authorization header](https://tools.ietf.org/html/rfc6750).

Bearer token is provided by [`API_TOKEN`](#enviromental-variables) enviromental variable. `API_TOKEN` variable will be replaced with OAuth 2.0 Client Credentials Grant Type flow in the [future](#future-improvements).

### Anonymization
- Data is anonymized by salted `sha512` ([src/helpers/sha512.ts](./src/helpers/sha512.ts)) hashing function
- Salt can be provided by [`ANONYMIZATION_SALT`](#enviromental-variables) enviromental variable

#### Email anonymization ([src/helpers/anonymization.helper.ts](./src/helpers/anonymization.helper.ts))
- The service recognizes 2 types of domains:
  1. internal - owned or controlled by your organization
  2. external
- Internal domains can be set by providing comma separated list of values to [`INTERNAL_DOMAIN_LIST`](#enviromental-variables) enviromental variable
- Email address (username@domain) anonymization depends on [`INTERNAL_DOMAIN_LIST`, `ANONYMIZE_INTERNAL_EMAIL_USERNAME`, `ANONYMIZE_INTERNAL_EMAIL_DOMAIN`, `ANONYMIZE_EXTRENAL_EMAIL_USERNAME`, `ANONYMIZE_EXTRENAL_EMAIL_DOMAIN`](#enviromental-variables) enviromental variables
- Every email address part is hashed by [`sha512`](#anonymization) function and truncated to the **first 16 characters**


##### Example: Internal domain anonymization
| Email             | [`ANONYMIZE_INTERNAL_EMAIL_USERNAME`](#enviromental-variables) | [`ANONYMIZE_INTERNAL_EMAIL_DOMAIN`](#enviromental-variables) | Anonymized email
| ----------------- | ----------------------------------- | --------------------------------- | ------------------
| user@internal.com | false                               | false                             | user@internal.com
| user@internal.com | false                               | true                              | user@anonymized.hash
| user@internal.com | true                                | false                             | anonymized@internal.com
| user@internal.com | true                                | true                              | anonymized@anonymized.hash

##### Example: External domain anonymization
| Email             | [`ANONYMIZE_EXTRENAL_EMAIL_USERNAME`](#enviromental-variables) | [`ANONYMIZE_EXTRENAL_EMAIL_DOMAIN`](#enviromental-variables) | Anonymized email
| ----------------- | ----------------------------------- | --------------------------------- | ------------------
| user@external.com | false                               | false                             | user@external.com
| user@external.com | false                               | true                              | user@anonymized.hash
| user@external.com | true                                | false                             | anonymized@external.com
| user@external.com | true                                | true                              | anonymized@anonymized.hash

#### File name anonymization ([src/helpers/anonymization.helper.ts](./src/helpers/anonymization.helper.ts))
- File name is replaced by character `'x'` (repeated `n times`) - `n` is the length of file name without extension
- File extension is always preserved

##### Example: File names anonymization
| File name             | Anonymized file name
| --------------------- | ---------------------
| somefilename.jpg      | xxxxxxxxxxxx.jpg
| .env                  | .env
| filename              | xxxxxxxx

#### Anonymization of private data in object properties

Every private property value is removed from the response.

##### Example: Anonymized private object properties
| Field type        | Return value
| ----------------- | -----------------------------------
| username          | empty string                       
| summary           | empty string                       
| description       | empty string                       
| subject           | empty string                       
| password          | empty string                       
| pin               | empty string                       
| secret string     | empty string                       
| secret boolean    | false
| secret number     | 0
| secret array      | empty array

### Resource representation
  Every endpoint has schema definition, that transforms api response.

  Response transformation complies with the following rules:
  1. Only properties defined in the schema are passed to the client
  2. Properties marked as **not private** are passed to the client without modification
  3. Properties marked as **private** are modified, their [return values](#confidential-fields-examples) are removed


### How to get Google api credentials
Follow https://developers.google.com/admin-sdk/directory/v1/guides/delegation guide to perform domain-wide delegation of authority with https://www.googleapis.com/auth/gmail.readonly and/or https://www.googleapis.com/auth/calendar.readonly API scopes.

Use `client_email` and `private_key` from generated service account credentials file (`credentials.json`) as [`GSUITE_CLIENT_EMAIL`](#enviromental-variables) and [`GSUITE_PRIVATE_KEY`](#enviromental-variables) enviromental variables respectively.

Populate `GSUITE_SCOPES` enviromental variable with comma separated scopes used in the service account creation guide.

### How to get Office 365 credentials
Follow https://docs.microsoft.com/en-us/office/office-365-management-api/get-started-with-office-365-management-apis to create Office 365 tenant ID, client ID and client Secret. Populate generated values to `O365_TENANT_ID`, `O365_CLIENT_ID`, `O365_CLIENT_SECRET` enviromental variables.

## Supported endpoints
### Google Gmail Api
#### `GET /www.googleapis.com/gmail/v1/users/:userId/messages`
  
  Lists the messages in the user's mailbox.

##### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

##### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

##### Query parameters
  See https://developers.google.com/gmail/api/v1/reference/users/messages/list#parameters

##### Response
  See https://developers.google.com/gmail/api/v1/reference/users/messages/list#response_1

##### Schema definition
  See [src/modules/googleapis/mappers/list-user-messages.mapper.ts](src/modules/googleapis/mappers/list-user-messages.mapper.ts)


#### `GET /www.googleapis.com/gmail/v1/users/:userId/messages/:id`

  Gets the message by `id`

##### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

##### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |
  | id             | string    | The message ID                   |

##### Query parameters
  See https://developers.google.com/gmail/api/v1/reference/users/messages/get#parameters

##### Response
  See https://developers.google.com/gmail/api/v1/reference/users/messages/get#response_1

##### Schema definition
  See [src/modules/googleapis/mappers/get-user-message.mapper.ts](src/modules/googleapis/mappers/get-user-message.mapper.ts)

#### `POST /www.googleapis.com/batch/gmail/v1`

  Batch api supports only `GET /www.googleapis.com/gmail/v1/users/:userId/messages` and `GET /www.googleapis.com/gmail/v1/users/:userId/messages/:id` requests

  See https://developers.google.com/gmail/api/guides/batch

### Google Calendar Api
#### `GET /www.googleapis.com/calendar/v3/users/:userId/calendarList`

  Returns the calendars on the user's calendar list.

##### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

##### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

##### Query parameters
  See https://developers.google.com/calendar/v3/reference/calendarList/list#parameters

##### Response
  See https://developers.google.com/calendar/v3/reference/calendarList/list#response_1

##### Schema definition
  See [src/modules/googleapis/mappers/list-user-calendars.mapper.ts](src/modules/googleapis/mappers/list-user-calendars.mapper.ts)

#### `GET /www.googleapis.com/calendar/v3/users/:userId/calendars/:calendarId/events`

  Returns events on the specified calendar.

##### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

##### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |
  | calendarId     | string    | The calendar ID                  |

##### Query parameters
  See https://developers.google.com/calendar/v3/reference/events/list#parameters

##### Response
  See https://developers.google.com/calendar/v3/reference/events/list#response_1

##### Schema definition
  See [src/modules/googleapis/mappers/list-calendar-events.mapper.ts](src/modules/googleapis/mappers/list-calendar-events.mapper.ts)

### Microsoft graph api
#### `GET /graph.microsoft.com/beta/users/:userId/calendars`

  Returns calendars of the specified user.

##### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

##### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

##### Query parameters
  See https://docs.microsoft.com/en-us/graph/api/user-list-calendars?view=graph-rest-beta&tabs=http#optional-query-parameters

##### Response
  See https://docs.microsoft.com/en-us/graph/api/user-list-calendars?view=graph-rest-beta&tabs=http#response

##### Schema definition
  See [src/modules/googleapis/mappers/list-calendar-calendars.mapper.ts](src/modules/microsoftgraph/mappers/list-user-calendars.mapper.ts)

#### `GET /graph.microsoft.com/beta/users/:userId/messages`

  Returns messages of the specified user.

##### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

##### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

##### Query parameters
  See https://docs.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-beta&tabs=http#optional-query-parameters

##### Response
  See https://docs.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-beta&tabs=http#response

##### Schema definition
  See [src/modules/googleapis/mappers/list-calendar-messages.mapper.ts](src/modules/microsoftgraph/mappers/list-user-messages.mapper.ts)

#### `GET /graph.microsoft.com/beta/users/:userId/events`

  Returns events of the specified user.

##### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

##### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

##### Query parameters
  See https://docs.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-beta&tabs=http#optional-query-parameters

##### Response
  See https://docs.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-beta&tabs=http#response

##### Schema definition
  See [src/modules/googleapis/mappers/list-calendar-events.mapper.ts](src/modules/microsoftgraph/mappers/list-user-events.mapper.ts)

#### `GET /graph.microsoft.com/beta/users/:userId/calendars/:calendarId/events`

  Returns events of the specified user and the specified calendar.

##### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

##### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |
  | calendarId     | string    | The calendar ID                  |

##### Query parameters
  See https://docs.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-beta&tabs=http#optional-query-parameters

##### Response
  See https://docs.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-beta&tabs=http#response

##### Schema definition
  See [src/modules/googleapis/mappers/list-user-events.mapper.ts](src/modules/microsoftgraph/mappers/list-user-events.mapper.ts)

<!---
##### Anonymized properties
  | Parameter path                          | Value     | Return value                     |
  | --------------------------------------- | --------- | -------------------------------- |
  | subject                                 | string    | Empty string                     |
  | bodyPreview                             | string    | Empty string                     |
  | body.content                            | string    | Empty string                     |
  | location.displayName                    | string    | Empty string                     |
  | location.locationUri                    | string    | Empty string                     |
--->

## Installation

### Run on GCP (2 minutes)

1. Create new GCP instance based on this docker image eu.gcr.io/proxy-272310/proxy:v1.0.3, see [how to do it in GCP](https://cloud.google.com/compute/docs/instances/create-start-instance#from-container-image)

2. Add/edit enviromental variables in the GCP instance editor UI

3. Start and [test your instance with cURL](#test)

### Run from docker container
Use the latest docker image from the GCP docker repository

1. ```docker pull eu.gcr.io/proxy-272310/proxy:v1.0.3```

2. Create and edit file with [enviromental variables](#enviromental-variables)
```shell
$ cp .env.example .env
$ vi .env
```

3. [enable SSL](#ssl)


### Run locally
1. Clone repository
```shell
$ git clone https://gitlab.com/time-is-ltd/anonymization-service.git
$ cd anonymization-service
```

2. Install npm packages
```shell
$ npm i
```

3. Create and edit file with [enviromental variables](#enviromental-variables)
```shell
$ cp .env.example .env
$ vi .env
```

4. [Optional: enable SSL](#ssl)

4. Optional: Run tests
```shell
$ npm run test
```

5. Install [pm2 process manager](https://pm2.keymetrics.io/)
```shell
$ npm install pm2 -g
```

1. Run service
```shell
$ pm2 start npm -- start
```

### Run using docker-compose
1. Clone repository
```shell
$ git clone https://gitlab.com/time-is-ltd/anonymization-service.git
$ cd anonymization-service
```

2. Create and edit file with [enviromental variables](#enviromental-variables)
```shell
$ cp .env.example .env
$ vi .env
```

4. [Optional: enable SSL](#ssl)

5. Build image
```shell
$ docker-compose build
```

6. Run image
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

3. Use printed value as [`SSL_KEY` enviromental variable](#enviromental-variables)

4. Convert certificate file (`cert.pem`) to one-line PEM format
```bash
$ awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' cert.pem
```

5. Use printed value as [`SSL_CERT` enviromental variable](#enviromental-variables)


## Enviromental variables
| Variable name                       | Value                | Example                               | Default value | Description
| ----------------------------------- | -------------------- | ------------------------------------- | ------------- |------------
| `API_TOKEN`                         | string               | 76xmfSGx26wmj4ty8UuGGDMhrPkwNkjk      |               | Authorization api token
| `INTERNAL_DOMAIN_LIST`              | comma separated list | yourdomain.com,yourdomain.eu          |               | List of internal domains
| `ANONYMIZE_EXTRENAL_EMAIL_DOMAIN`   | boolean              | true                                  | true          | Anononymize external domain in emails
| `ANONYMIZE_EXTRENAL_EMAIL_USERNAME` | boolean              | true                                  | true          | Anononymize external username in emails
| `ANONYMIZE_INTERNAL_EMAIL_DOMAIN`   | boolean              | true                                  | false         | Anononymize internal domain in emails
| `ANONYMIZE_INTERNAL_EMAIL_USERNAME` | boolean              | true                                  | true          | Anononymize internal username in emails
| `ANONYMIZATION_SALT`                | string               | yvUCixgSV6EMcE2FpZispWkju8N3LrWp      | true          | Salt that is used in data anonymization. Must be 32 characters long.
| `HTTP_PORT`                         | number               | 80                                    |               | Http listening port
| `HTTPS_PORT`                        | number               | 443                                   |               | Https listening port. You have to provide `SSL_KEY` and `SSL_CERT` enviromental variables
| `SSL_KEY`                           | string               |                  |               | Converted file with private key (`key.pem`) to one-line PEM format. Follow [SSL guide](#ssl) to get SSL PEM files.
| `SSL_CERT`                          | string               |                 |               | Converted file with certificate (`cert.pem`) to one-line PEM format. Follow [SSL guide](#ssl) to get SSL PEM files.
| `GSUITE_CLIENT_EMAIL`        | string               |             |               | Value of `client_email` property located in google service account credentials.json file. You can get google service account credentials via [How to get Google api credentials guide](#how-to-get-google-api-credentials).
| `GSUITE_PRIVATE_KEY`        | string               |             |               | Value of `private_key` property located in google service account credentials.json file. You can get google service account credentials via [How to get Google api credentials guide](#how-to-get-google-api-credentials).
| `GSUITE_SCOPES`                     | string               | https://www.googleapis.com/auth/gmail.readonly, https://www.googleapis.com/auth/calendar.readonly |               | OAuth 2.0 Scopes for Google APIs
| `O365_TENANT_ID`                    | string               | 00000000-0000-0000-0000-000000000000  |               | Office 365 tenant ID. You can get tenant ID via [How to get Office 365 credentials guide](#how-to-get-office-365-credentials)
| `O365_CLIENT_ID`                    | string               | 00000000-0000-0000-0000-000000000000  |               | Office 365 client ID. You can get client ID via [How to get Office 365 credentials guide](#how-to-get-office-365-credentials)
| `O365_CLIENT_SECRET`                | string               |                                       |               | Office 365 client secret. You can get client secret via [How to get Office 365 credentials guide](#how-to-get-office-365-credentials)

## Test with cURL

Get anonymized G Suite email messages response from the anonymization service with cURL

```
curl -X GET \
  https://your_IP/www.googleapis.com/gmail/v1/users/your_email@your_company.com/messages \
  -H 'Authorization: Bearer your_api_key' \
  -H 'Cache-Control: no-cache' --insecure
```

- your_IP is the IP of the instance running the anonymization service
- your_email@your_company.com your G Suite email address
- Bearer is your API key (to clarify, the API key is your generated key - string, 32 chars)


## Future improvements
1. Implement [OAuth 2.0 Client Credentials Grant Type](https://tools.ietf.org/html/rfc6749#section-4.4) to receive Bearer jwt authorization token and use it instead of `API_TOKEN`
