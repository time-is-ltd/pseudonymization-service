import { transformPath } from '../../proxy'
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

const listUserCalendarsPath = '/calendar/v3/users/:userId/calendarList'
const listCalendarEventsPath = '/calendar/v3/users/:userId/calendars/:calendarId/events'

export const paths = {
  listUserMessagesPath,
  getUserMessagePath,
  listUserCalendarsPath,
  listCalendarEventsPath,
  batchRequestPath
}

export const pathTransforms = {
  listUserCalendarsPath: transformPath<{ userId: string }>(
    listUserCalendarsPath,
    ({ path, params: { userId } }) => path.replace(userId, 'me')
  ),
  listCalendarEventsPath: transformPath<{ userId: string }>(
    listCalendarEventsPath,
    ({ path, params: { userId } }) => path.replace(`/users/${userId}`, '')
  )
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
