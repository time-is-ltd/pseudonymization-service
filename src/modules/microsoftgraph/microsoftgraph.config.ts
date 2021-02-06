
import { getSecret } from '../../keyvault/keyvault.service'
import config from '../../config'

// Config Env
export const microsoftApiEnabled = config.microsoftApiEnabled

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

export default {
  microsoftApiEnabled,
  hosts,
  paths
}
