import { getPathPartFactory } from '../../helpers/path.helper'
import { configFactory, toString, toPem, toArray } from '../../config'

const googleApisConfig = {
  gsuiteClientEmail: toString(),
  gsuitePrivateKey: toPem(),
  gsuiteScopes: toArray()
}

const config = configFactory(googleApisConfig, [
  'gsuiteClientEmail',
  'gsuitePrivateKey',
  'gsuiteScopes'
])

// Hosts
export const hosts = [
  'www.googleapis.com',
  'gmail.googleapis.com'
]

// Router paths
const listUserMessagesPath = '/gmail/v1/users/:userId/messages'
const getUserMessagePath = '/gmail/v1/users/:userId/messages/:id'
const batchRequestPath = '/batch/gmail/v1'

// 2.0 SDK
const listUserMessagesPath2 = '/gmail/v2/users/:userId/messages'
const getUserMessagePath2 = '/gmail/v2/users/:userId/messages/:id'
const batchRequestPath2 = '/batch/gmail/v2'

const listUserCalendarsPath = '/calendar/v3/users/:userId/calendarList'
const listCalendarEventsPath = '/calendar/v3/users/:userId/calendars/:calendarId/events'

export const paths = {
  listUserMessagesPath,
  getUserMessagePath,
  listUserCalendarsPath,
  listUserMessagesPath2,
  getUserMessagePath2,
  batchRequestPath2,
  listCalendarEventsPath,
  batchRequestPath
}

const listUserCalendarsPathUsernameFactory = getPathPartFactory(listUserCalendarsPath, 1)
const listCalendarEventsPathUsernameFactory = getPathPartFactory(listCalendarEventsPath, 1)

export const pathTransforms = {
  listUserCalendarsPath: (path: string) => {
    const username = listUserCalendarsPathUsernameFactory(path)
    if (!username) {
      return path
    }
    return path.replace(username, 'me')
  },
  listCalendarEventsPath: (path: string) => {
    const username = listCalendarEventsPathUsernameFactory(path)
    if (!username) {
      return path
    }
    return path.replace(`/users/${username}`, '')
  }
}

export const clientEmail = config.gsuiteClientEmail
export const privateKey = config.gsuitePrivateKey
export const scopes = config.gsuiteScopes

export default {
  clientEmail,
  privateKey,
  scopes,
  hosts,
  paths
}
