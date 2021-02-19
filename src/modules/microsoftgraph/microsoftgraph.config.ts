import { configFactory, toArray, toBoolean, toNumber, toPem, toString } from '../../config'

const googleApisConfig = {
  o365TenantId: toString(),
  o365ClientId: toString(),
  o365ClientSecret: toString()
}

const config = configFactory(googleApisConfig, [
  'o365TenantId',
  'o365ClientId',
  'o365ClientSecret'
])

// Hosts
export const hosts = [
  'graph.microsoft.com'
]

// Router paths
const listUserMessagesPath = '/v1.0/users/:userId/messages'
const listUserCalendarsPath = '/v1.0/users/:userId/calendars'
const listUserEventsPath = '/v1.0/users/:userId/events'
const listCalendarEventsPath = '/v1.0/users/:userId/calendars/:calendarId/events'
const listCalendarViewPath = '/v1.0/users/:userId/calendars/:calendarId/calendarview'

export const paths = {
  listUserMessagesPath,
  listUserCalendarsPath,
  listUserEventsPath,
  listCalendarEventsPath,
  listCalendarViewPath
}

export const tenantId = config.o365TenantId
export const clientId = config.o365ClientId
export const clientSecret = config.o365ClientSecret

export default {
  tenantId,
  clientId,
  clientSecret,
  hosts,
  paths
}
