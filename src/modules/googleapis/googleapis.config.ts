import { transformPath } from '../../proxy'
import { configFactory, toString, toPem, toArray } from '../../config'

const googleApisConfig = {
  gsuiteClientEmail: toString(),
  gsuitePrivateKey: toPem(),
  gsuiteScopes: toArray(),
  gsuiteAdminEmail: toString()
}

const config = configFactory(googleApisConfig, [
  'gsuiteClientEmail',
  'gsuitePrivateKey',
  'gsuiteScopes',
  'gsuiteAdminEmail'
])

// Hosts
export type Host = 'admin.googleapis.com' | 'gmail.googleapis.com' | 'www.googleapis.com'
export const hosts: {
  gmail: Host[]
  calendar: Host[]
  admin: Host[]
} = {
  gmail: [
    'gmail.googleapis.com',
    'www.googleapis.com'
  ],
  calendar: [
    'www.googleapis.com'
  ],
  admin: [
    'admin.googleapis.com'
  ]
}

// Router paths
const listUserMessagesPath = '/gmail/v1/users/:userId/messages'
const getUserMessagePath = '/gmail/v1/users/:userId/messages/:id'
const batchRequestPath = '/batch/gmail/v1'

const listUserCalendarsPath = '/calendar/v3/users/:userId/calendarList'
const listCalendarEventsPath = '/calendar/v3/users/:userId/calendars/:calendarId/events'

const listActivityReportsMeet = '/admin/reports/v1/activity/users/all/applications/meet'
const listActivityReportsDrive = '/admin/reports/v1/activity/users/all/applications/drive'
const listUsageReports = '/admin/reports/v1/usage/dates/:date'

export const paths = {
  listUserMessagesPath,
  getUserMessagePath,
  listUserCalendarsPath,
  listCalendarEventsPath,
  batchRequestPath,
  listActivityReportsMeet,
  listActivityReportsDrive,
  listUsageReports
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
export const adminEmail = config.gsuiteAdminEmail

export default {
  clientEmail,
  privateKey,
  adminEmail,
  scopes,
  hosts,
  paths
}
