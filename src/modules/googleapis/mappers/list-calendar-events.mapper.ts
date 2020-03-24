import {
  jsonMapper,
  Schema,
  TYPES
} from '../../../helpers/mapper.helper'

export interface EventDate {
  date: string
  dateTime: string
  timezone: string
}

export interface EventUser {
  id: string,
  email: string,
  displayName: string,
  self: boolean
}

export interface EventAttendee extends EventUser {
  organizer: boolean
  responseStatus: string
  resource: boolean
  optional: boolean
  comment: string
  additionalGuests?: number
}

export interface EventItemCreateRequest {
  requestId: string
  conferenceSolutionKey: {
    type: string
  }
  status: {
    statusCode: string
  }
}

export interface EventItemConferenceDataEntrypoint {
  entryPointType: string
  uri: string
  label: string
  pin: string
  accessCode: string
  meetingCode: string
  passcode: string
  password: string
}

export interface EventItemConferenceSolution {
  key: {
    type: string
  }
  name: string
  iconUri: string
}

export interface EventItemGadget {
  type: string
  title: string
  link: string
  iconLink: string
  width: number
  height: number
  display: string
}

export interface EventItemConferenceDataRemindersOverride {
  method: string
  minutes: number
}

export interface EventItemConferenceDataReminders {
  useDefault: boolean
  overrides: EventItemConferenceDataRemindersOverride[]
}

export interface EventItemConferenceDataSource {
  url: string
  title: string
}

export interface EventItemConferenceDataAttachment {
  fileUrl: string
  title: string
  mimeType: string
  iconLink: string
  fileId: string
}

export interface EventItemConferenceData {
  createRequest: EventItemCreateRequest
  entryPoints: EventItemConferenceDataEntrypoint[]
  conferenceSolution: EventItemConferenceSolution
  conferenceId: string
  signature: string
  notes: string
  gadget: EventItemGadget
}

export interface EventItem {
  kind: string
  etag: string
  id: string
  status: string
  htmlLink: string
  created: string
  updated: string
  summary: string
  description: string
  creator: EventUser
  organizer: EventUser
  start: EventDate
  end: EventDate
  endTimeUnspecified: boolean
  recurrence: string[]
  recurringEventId: string
  originalStartTime: EventDate
  transparency: string
  visibility: string
  iCalUID: string
  sequence: number
  attendees: EventAttendee[]
  attendeesOmitted: boolean
  hangoutLink: string
  conferenceData: EventItemConferenceData
  anyoneCanAddSelf: boolean
  guestsCanInviteOthers: boolean
  guestsCanModify: boolean
  guestsCanSeeOtherGuests: boolean
  privateCopy: boolean
  locked: boolean
  reminders:EventItemConferenceDataReminders
  source: EventItemConferenceDataSource
  attachments: EventItemConferenceDataAttachment[]
}

export interface EventDefaultReminder {
  method: string,
  minutes: number
}

export interface Event {
  kind: string
  etag: string
  summary: string
  updated: string
  timeZone: string
  accessRole: string
  defaultReminders: EventDefaultReminder[]
  nextSyncToken: string
  nextPageToken: string
  items: EventItem[]
}

const eventDateSchema: Schema<EventDate> = {
  date: TYPES.Datetime,
  dateTime: TYPES.Datetime,
  timezone: TYPES.String
}

const eventUserSchema: Schema<EventUser> = {
  id: TYPES.String,
  email: TYPES.Email,
  displayName: [
    TYPES.Username,
    TYPES.Private
  ],
  self: TYPES.Boolean
}

const schema: Schema<Event> = {
  kind: TYPES.String,
  etag: TYPES.ETag,
  summary: [
    TYPES.Text,
    TYPES.Private
  ],
  updated: TYPES.Datetime,
  timeZone: TYPES.String,
  accessRole: TYPES.String,
  defaultReminders: [
    {
      method: TYPES.String,
      minutes: TYPES.Number
    }
  ],
  nextSyncToken: TYPES.String,
  nextPageToken: TYPES.String,
  items: [
    {
      kind: TYPES.String,
      etag: TYPES.ETag,
      id: TYPES.Id,
      status: TYPES.String,
      htmlLink: [
        TYPES.Url,
        TYPES.Private
      ],
      created: TYPES.Datetime,
      updated: TYPES.Datetime,
      summary: [
        TYPES.Text,
        TYPES.Private
      ],
      description: [
        TYPES.Text,
        TYPES.Private
      ],
      creator: eventUserSchema,
      organizer: eventUserSchema,
      start: eventDateSchema,
      end: eventDateSchema,
      endTimeUnspecified: TYPES.Boolean,
      recurrence: [
        TYPES.String,
        TYPES.Array
      ],
      recurringEventId: TYPES.String,
      originalStartTime: eventDateSchema,
      transparency: TYPES.String,
      visibility: TYPES.String,
      iCalUID: TYPES.String,
      sequence: TYPES.Number,
      attendees: [
        {
          id: TYPES.String,
          email: TYPES.Email,
          displayName: [
            TYPES.Username,
            TYPES.Private
          ],
          self: TYPES.Boolean,
          organizer: TYPES.Boolean,
          responseStatus: TYPES.String,
          resource: TYPES.Boolean,
          optional: TYPES.Boolean,
          comment: [
            TYPES.Text,
            TYPES.Private
          ],
          additionalGuests: TYPES.Number
        }
      ],
      attendeesOmitted: TYPES.Boolean,
      hangoutLink: [
        TYPES.Url,
        TYPES.Private
      ],
      conferenceData: {
        createRequest: {
          requestId: TYPES.String,
          conferenceSolutionKey: {
            type: TYPES.String
          },
          status: {
            statusCode: TYPES.String
          }
        },
        entryPoints: [
          {
            entryPointType: TYPES.String,
            uri: [
              TYPES.Url,
              TYPES.Private
            ],
            label: [
              TYPES.Text,
              TYPES.Private
            ],
            pin: [
              TYPES.String,
              TYPES.Private
            ],
            accessCode: [
              TYPES.String,
              TYPES.Private
            ],
            meetingCode: [
              TYPES.String,
              TYPES.Private
            ],
            passcode: [
              TYPES.String,
              TYPES.Private
            ],
            password: [
              TYPES.String,
              TYPES.Private
            ]
          }
        ],
        conferenceSolution: {
          key: {
            type: TYPES.String
          },
          name: TYPES.String,
          iconUri: TYPES.String
        },
        conferenceId: TYPES.String,
        signature: [
          TYPES.String,
          TYPES.Private
        ],
        notes: [
          TYPES.Text,
          TYPES.Private
        ],
        gadget: {
          type: TYPES.String,
          title: [
            TYPES.String,
            TYPES.Private
          ],
          link: [
            TYPES.Url,
            TYPES.Private
          ],
          iconLink: [
            TYPES.Url,
            TYPES.Private
          ],
          width: TYPES.Number,
          height: TYPES.Number,
          display: TYPES.String
        },
      },
      anyoneCanAddSelf: TYPES.Boolean,
      guestsCanInviteOthers: TYPES.Boolean,
      guestsCanModify: TYPES.Boolean,
      guestsCanSeeOtherGuests: TYPES.Boolean,
      privateCopy: TYPES.Boolean,
      locked: TYPES.Boolean,
      reminders: {
        useDefault: TYPES.Boolean,
        overrides: [
          {
            method: TYPES.String,
            minutes: TYPES.Number
          }
        ]
      },
      source: {
        url: [
          TYPES.Url,
          TYPES.Private
        ],
        title: [
          TYPES.Url,
          TYPES.Private
        ],
      },
      attachments: [
        {
          fileUrl: [
            TYPES.Url,
            TYPES.Private
          ],
          title: [
            TYPES.String,
            TYPES.Private
          ],
          mimeType: TYPES.ContentType,
          iconLink: [
            TYPES.Url,
            TYPES.Private
          ],
          fileId: TYPES.String
        }
      ]
    }
  ]
}

export default jsonMapper<typeof schema, Event>(schema)
