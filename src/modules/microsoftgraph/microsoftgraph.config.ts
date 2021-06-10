import {configFactory, toString} from '../../config'

const googleApisConfig = {
  o365TenantId: toString(),
  o365ClientId: toString(),
  o365ClientSecret: toString(),
  o365RefreshToken: toString()
}

const config = configFactory(googleApisConfig, [
  'o365TenantId',
  'o365ClientId',
  'o365ClientSecret',
  'o365RefreshToken'
])

// Hosts
export const hosts = [
  'graph.microsoft.com'
]


// Router paths
const listUserMessagesPath = '/v1.0/users/:userId/messages'
const listUserCalendarsPath = '/v1.0/users/:userId/calendars'
const listUserEventsPath = '/v1.0/users/:userId/events'
const listCalendarEventsPath = [
    '/v1.0/users/:userId/calendars/:calendarId/events',
    "/v1.0/users/:userId/calendars\\(':calendarId'\\)/events"
]
const listCalendarViewPath = [
    '/v1.0/users/:userId/calendars/:calendarId/calendarview',
    "/v1.0/users/:userId/calendars\\(':calendarId'\\)/calendarview"
]

const subscriptionsPath = '/v1.0/subscriptions'
const subscriptionsIdPath = '/v1.0/subscriptions/:id'
const listComunicationsCallRecordsPath = '/v1.0/communications/callRecords/:id'
const listComunicationsCallRecordsSessionsPath = '/v1.0/communications/callRecords/:id/sessions'
const getUserIdPath = '/v1.0/users/:userId'
const listMailFoldersPath = '/v1.0/users/:userId/mailFolders'
const getMailFolderPath = '/v1.0/users/:userId/mailFolders/:id'
const listMailFolderMessagesPath = '/v1.0/users/:userId/mailFolders/:id/messages'

export const paths = {
  listUserMessagesPath,
  listUserCalendarsPath,
  listUserEventsPath,
  listCalendarEventsPath,
  listCalendarViewPath,
  subscriptionsPath,
  subscriptionsIdPath,
  listComunicationsCallRecordsPath,
  listComunicationsCallRecordsSessionsPath,
  getUserIdPath,
  listMailFoldersPath,
  getMailFolderPath,
  listMailFolderMessagesPath
}

export const tenantId = config.o365TenantId
export const clientId = config.o365ClientId
export const clientSecret = config.o365ClientSecret
export const refreshToken = config.o365RefreshToken

export default {
  tenantId,
  clientId,
  clientSecret,
  refreshToken,
  hosts,
  paths
}
