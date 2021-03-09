# Supported endpoints

## Resource representation
  Every endpoint has `schema definition`, that maps api response.

  Response mapping complies with the following rules:
  1. Only properties defined in the schema are passed to the client
  2. Properties marked as **not private** are passed to the client without modification
  3. Properties marked as **private** are modified, their [return values](./how-it-works.md#anonymization-of-private-data-in-object-properties) are removed
   
## Google Gmail API
### `GET /www.googleapis.com/gmail/v1/users/:userId/messages`

  Lists the messages in the user's mailbox.

#### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

#### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

#### Query parameters
  See https://developers.google.com/gmail/api/v1/reference/users/messages/list#parameters

#### Response
  See https://developers.google.com/gmail/api/v1/reference/users/messages/list#response_1

#### Schema definition
  See [src/modules/googleapis/mappers/list-user-messages.mapper.ts](../src/modules/googleapis/mappers/list-user-messages.mapper.ts)


### `GET /www.googleapis.com/gmail/v1/users/:userId/messages/:id`

  Gets the message by `id`

#### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

#### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |
  | id             | string    | The message ID                   |

#### Query parameters
  See https://developers.google.com/gmail/api/v1/reference/users/messages/get#parameters

#### Response
  See https://developers.google.com/gmail/api/v1/reference/users/messages/get#response_1

#### Schema definition
  See [src/modules/googleapis/mappers/get-user-message.mapper.ts](../src/modules/googleapis/mappers/get-user-message.mapper.ts)

### `POST /www.googleapis.com/batch/gmail/v1`

  Batch api supports only `GET /www.googleapis.com/gmail/v1/users/:userId/messages` and `GET /www.googleapis.com/gmail/v1/users/:userId/messages/:id` requests

  See https://developers.google.com/gmail/api/guides/batch

## Google Calendar API
### `GET /www.googleapis.com/calendar/v3/users/:userId/calendarList`

  Returns the calendars on the user's calendar list.

#### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

#### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

#### Query parameters
  See https://developers.google.com/calendar/v3/reference/calendarList/list#parameters

#### Response
  See https://developers.google.com/calendar/v3/reference/calendarList/list#response_1

#### Schema definition
  See [src/modules/googleapis/mappers/list-user-calendars.mapper.ts](../src/modules/googleapis/mappers/list-user-calendars.mapper.ts)

### `GET /www.googleapis.com/calendar/v3/users/:userId/calendars/:calendarId/events`

  Returns events on the specified calendar.

#### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

#### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |
  | calendarId     | string    | The calendar ID                  |

#### Query parameters
  See https://developers.google.com/calendar/v3/reference/events/list#parameters

#### Response
  See https://developers.google.com/calendar/v3/reference/events/list#response_1

#### Schema definition
  See [src/modules/googleapis/mappers/list-calendar-events.mapper.ts](../src/modules/googleapis/mappers/list-calendar-events.mapper.ts)

## Microsoft Graph API
### `GET /graph.microsoft.com/beta/users/:userId/calendars`

  Returns calendars of the specified user.

#### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

#### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

#### Query parameters
  See https://docs.microsoft.com/en-us/graph/api/user-list-calendars?view=graph-rest-beta&tabs=http#optional-query-parameters

#### Response
  See https://docs.microsoft.com/en-us/graph/api/user-list-calendars?view=graph-rest-beta&tabs=http#response

#### Schema definition
  See [src/modules/googleapis/mappers/list-calendar-calendars.mapper.ts](../src/modules/microsoftgraph/mappers/list-user-calendars.mapper.ts)

### `GET /graph.microsoft.com/beta/users/:userId/messages`

  Returns messages of the specified user.

#### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

#### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

#### Query parameters
  See https://docs.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-beta&tabs=http#optional-query-parameters

#### Response
  See https://docs.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-beta&tabs=http#response

#### Schema definition
  See [src/modules/googleapis/mappers/list-calendar-messages.mapper.ts](../src/modules/microsoftgraph/mappers/list-user-messages.mapper.ts)

### `GET /graph.microsoft.com/beta/users/:userId/events`

  Returns events of the specified user.

#### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

#### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |

#### Query parameters
  See https://docs.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-beta&tabs=http#optional-query-parameters

#### Response
  See https://docs.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-beta&tabs=http#response

#### Schema definition
  See [src/modules/googleapis/mappers/list-calendar-events.mapper.ts](../src/modules/microsoftgraph/mappers/list-user-events.mapper.ts)

### `GET /graph.microsoft.com/beta/users/:userId/calendars/:calendarId/events`

  Returns events of the specified user and the specified calendar.

#### Request Headers
  | Header name    | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | Authorization  | string    | Bearer {apiToken}. Required.     |

#### Parameters
  | Parameter name | Value     | Description                      |
  | -------------- | --------- | -------------------------------- |
  | userId         | string    | The user's email address         |
  | calendarId     | string    | The calendar ID                  |

#### Query parameters
  See https://docs.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-beta&tabs=http#optional-query-parameters

#### Response
  See https://docs.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-beta&tabs=http#response

#### Schema definition
  See [src/modules/googleapis/mappers/list-user-events.mapper.ts](../src/modules/microsoftgraph/mappers/list-user-events.mapper.ts)
