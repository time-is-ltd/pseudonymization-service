import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../mapper'

export interface UserCalendarDefaultReminder {
  method: string
  minutes: number
}

export interface UserCalendarsNotification {
  type: string
  method: string
}

export interface UserCalendarsNotificationSettings {
  notifications: UserCalendarsNotification[]
}

export interface UserCalendarConferenceProperties {
  allowedConferenceSolutionTypes: string[]
}

export interface UserCalendar {
  id: string
  kind: string
  etag: string
  summary: string
  description: string
  location: string
  timeZone: string
  summaryOverride: string
  colorId: string
  backgroundColor: string
  foregroundColor: string
  hidden: boolean
  selected: boolean
  accessRole: string
  defaultReminders: UserCalendarDefaultReminder[]
  notificationSettings: UserCalendarsNotificationSettings
  primary: boolean
  deleted: boolean
  conferenceProperties: UserCalendarConferenceProperties
}

export interface UserCalendars {
  kind: string
  etag: string
  items: UserCalendar[]
  nextPageToken: string
  resultSizeEstimate: string
}

const schema: Schema<UserCalendars> = {
  kind: TYPES.String,
  etag: TYPES.ETag,
  items: [
    {
      id: TYPES.Id,
      kind: TYPES.String,
      etag: TYPES.String,
      summary: [
        TYPES.Private,
        TYPES.Text
      ],
      description: [
        TYPES.Private,
        TYPES.Text
      ],
      location: TYPES.String,
      timeZone: TYPES.Datetime,
      summaryOverride: [
        TYPES.Private,
        TYPES.String
      ],
      colorId: TYPES.String,
      backgroundColor: TYPES.String,
      foregroundColor: TYPES.String,
      hidden: TYPES.Boolean,
      selected: TYPES.Boolean,
      accessRole: TYPES.String,
      defaultReminders: [
        {
          method: TYPES.String,
          minutes: TYPES.Number
        }
      ],
      notificationSettings: {
        notifications: [
          {
            type: TYPES.String,
            method: TYPES.String
          }
        ]
      },
      primary: TYPES.Boolean,
      deleted: TYPES.Boolean,
      conferenceProperties: {
        allowedConferenceSolutionTypes: [
          TYPES.String,
          TYPES.Array
        ]
      }
    }
  ],
  nextPageToken: TYPES.String,
  resultSizeEstimate: TYPES.String
}

export const listUserCalendarsMapper = jsonMapper<typeof schema, UserCalendars>(schema)
