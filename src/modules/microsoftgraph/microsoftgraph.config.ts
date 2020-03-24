// Env variables
export const tenantId: string = process.env.O365_TENANT_ID 
export const clientId: string = process.env.O365_CLIENT_ID 
export const clientSecret: string = process.env.O365_CLIENT_SECRET 

// Hosts
export const hosts = [
  'graph.microsoft.com'
]

// Router paths
const listUserMessagesPath = '/beta/users/:userId/messages'
const listUserCalendarsPath = '/beta/users/:userId/calendars'
const listUserEventsPath = '/beta/users/:userId/events'
const listCalendarEventsPath = '/beta/users/:userId/calendars/:calendarId/events'

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
