// Env variables
export const tenantId: string | undefined = process.env.O365_TENANT_ID 
export const clientId: string | undefined = process.env.O365_CLIENT_ID 
export const clientSecret: string | undefined = process.env.O365_CLIENT_SECRET 

// Hosts
export const hosts = [
  'graph.microsoft.com'
]

// Router paths
const listUserMessagesPath = '/v1.0/users/:userId/messages'
const listUserCalendarsPath = '/v1.0/users/:userId/calendars'
const listUserEventsPath = '/v1.0/users/:userId/events'
const listCalendarEventsPath = '/v1.0/users/:userId/calendars/:calendarId/events'

export const paths = {
  listUserMessagesPath,
  listUserCalendarsPath,
  listUserEventsPath,
  listCalendarEventsPath
}

export default {
  tenantId,
  clientId,
  clientSecret,
  hosts,
  paths
}
