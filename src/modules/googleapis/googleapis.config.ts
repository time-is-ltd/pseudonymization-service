import { getPathPartFactory } from '../../helpers/path.helper'

// Env variables
export const credentialsPath: string | undefined = process.env.GSUITE_CREDENTIALS_PATH
export const scopes: string[] = (process.env.GSUITE_SCOPES || '').split(',')

// Hosts
export const hosts = [
  'www.googleapis.com'
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

export default {
  credentialsPath,
  scopes,
  hosts,
  paths
}
