import { getPathPartFactory } from '../../helpers/path.helper'
import config from '../../config'

// Hosts
export const hosts = [
  'www.googleapis.com',
  'gmail.googleapis.com'
]

// Config Env
export const googleApiEnabled = config.googleApiEnabled

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

export default {
  googleApiEnabled,
  hosts,
  paths,
  pathTransforms
}
