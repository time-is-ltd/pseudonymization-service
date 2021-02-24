import calendarEventsMapper, {
  Event,
  EventAttendee,
  EventUser
} from './list-calendar-events.mapper'

import {
  PersonId,
  getEmail,
  getAnonymizedEmail,
  testMapper
} from '../../../helpers/testing'

jest.mock('../../../anonymizer')

const buildInputUser = (id: PersonId, self = false): EventUser => {
  const email = getEmail(id)
  return {
    id: `${id}`,
    email: email.address,
    displayName: email.name,
    self
  }
}

const buildOutputUser = (id: PersonId, self = false): EventUser => {
  const email = getAnonymizedEmail(id)
  return {
    id: `${id}`,
    email: email.address,
    displayName: email.name,
    self
  }
}

const buildInputAttendee = (id: PersonId, organizer = false): EventAttendee => {
  const user = buildInputUser(id)
  return {
    ...user,
    organizer,
    responseStatus: 'approved',
    resource: false,
    optional: true,
    comment: 'comment',
    additionalGuests: 10
  }
}

const buildOutputAttendee = (id: PersonId, organizer = false): EventAttendee => {
  const user = buildOutputUser(id)
  return {
    ...user,
    organizer,
    responseStatus: 'approved',
    resource: false,
    optional: true,
    comment: '',
    additionalGuests: 10
  }
}

const inputEvent: Event = {
  kind: 'calendar#events',
  etag: '\'p3hsa7g2ekvuasc0g\'',
  summary: 'test@test.com',
  updated: '2019-12-18T13:17:55.691Z',
  timeZone: 'Europe/Prague',
  accessRole: 'owner',
  defaultReminders: [],
  nextSyncToken: 'nextSyncToken',
  nextPageToken: 'nextPageToken',
  items: [
    {
      kind: 'calendar#event',
      etag: '\'e4e65354-5b2a-4981-b7c7-55c37481c29e\'',
      id: '3938f8be-9713-4330-9fda-bdab643d6843',
      status: 'confirmed',
      htmlLink: 'https://www.google.com/calendar/event?eid=',
      created: '2019-04-26T08:53:25.000Z',
      updated: '2019-04-28T18:39:32.321Z',
      summary: 'Event summary',
      description: 'Event Description',
      creator: buildInputUser(1),
      organizer: buildInputUser(1),
      start: {
        date: '2019-04-29',
        dateTime: '2019-04-29T10:00:00+02:00',
        timezone: 'Europe/Prague'
      },
      end: {
        date: '2019-04-29',
        dateTime: '2019-04-29T10:30:00+02:00',
        timezone: 'Europe/Prague'
      },
      endTimeUnspecified: true,
      recurrence: ['ok'],
      recurringEventId: 'recurringEventId',
      originalStartTime: {
        date: '2019-04-29',
        dateTime: '2019-04-29T10:00:00+02:00',
        timezone: 'Europe/Prague'
      },
      transparency: 'transparency',
      visibility: 'visibility',
      iCalUID: 'random@google.com',
      sequence: 0,
      attendees: [
        buildInputAttendee(1, true),
        buildInputAttendee(2),
        buildInputAttendee(3)
      ],
      attendeesOmitted: false,
      hangoutLink: 'https://sample',
      conferenceData: {
        createRequest: {
          requestId: 'requestId',
          conferenceSolutionKey: {
            type: 'type'
          },
          status: {
            statusCode: 'statusCode'
          }
        },
        entryPoints: [
          {
            entryPointType: 'entryPointType',
            uri: 'https://sample.com',
            label: 'label',
            pin: '1234',
            accessCode: '1234',
            meetingCode: '1234',
            passcode: '1234',
            password: '1234'
          }
        ],
        conferenceSolution: {
          key: {
            type: 'type'
          },
          name: 'name',
          iconUri: 'https://sample.com'
        },
        conferenceId: 'conferenceId',
        signature: 'signature',
        notes: 'notes',
        gadget: {
          type: 'type',
          title: 'title',
          link: 'https://sample.com',
          iconLink: 'https://sample.com',
          width: 100,
          height: 200,
          display: 'display'
        },
      },
      anyoneCanAddSelf: true,
      guestsCanInviteOthers: true,
      guestsCanModify: true,
      guestsCanSeeOtherGuests: false,
      privateCopy: true,
      locked: false,
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'method',
            minutes: 10
          }
        ]
      },
      source: {
        url: 'https://sample.com',
        title: 'title'
      },
      attachments: [
        {
          fileUrl: 'https://sample.com',
          title: 'title',
          mimeType: 'mimeType',
          iconLink: 'https://sample.com',
          fileId: 'fileId'
        }
      ]
    }
  ]
}

const outputEvent: Event = {
  kind: 'calendar#events',
  etag: '\'p3hsa7g2ekvuasc0g\'',
  summary: '',
  updated: '2019-12-18T13:17:55.691Z',
  timeZone: 'Europe/Prague',
  accessRole: 'owner',
  defaultReminders: [],
  nextSyncToken: 'nextSyncToken',
  nextPageToken: 'nextPageToken',
  items: [
    {
      kind: 'calendar#event',
      etag: '\'e4e65354-5b2a-4981-b7c7-55c37481c29e\'',
      id: '3938f8be-9713-4330-9fda-bdab643d6843',
      status: 'confirmed',
      htmlLink: '',
      created: '2019-04-26T08:53:25.000Z',
      updated: '2019-04-28T18:39:32.321Z',
      summary: '',
      description: '',
      creator: buildOutputUser(1),
      organizer: buildOutputUser(1),
      start: {
        date: '2019-04-29',
        dateTime: '2019-04-29T10:00:00+02:00',
        timezone: 'Europe/Prague'
      },
      end: {
        date: '2019-04-29',
        dateTime: '2019-04-29T10:30:00+02:00',
        timezone: 'Europe/Prague'
      },
      endTimeUnspecified: true,
      recurrence: ['ok'],
      recurringEventId: 'recurringEventId',
      originalStartTime: {
        date: '2019-04-29',
        dateTime: '2019-04-29T10:00:00+02:00',
        timezone: 'Europe/Prague'
      },
      transparency: 'transparency',
      visibility: 'visibility',
      iCalUID: 'random@google.com',
      sequence: 0,
      attendees: [
        buildOutputAttendee(1, true),
        buildOutputAttendee(2),
        buildOutputAttendee(3)
      ],
      attendeesOmitted: false,
      hangoutLink: '',
      conferenceData: {
        createRequest: {
          requestId: 'requestId',
          conferenceSolutionKey: {
            type: 'type'
          },
          status: {
            statusCode: 'statusCode'
          }
        },
        entryPoints: [
          {
            entryPointType: 'entryPointType',
            uri: '',
            label: '',
            pin: '',
            accessCode: '',
            meetingCode: '',
            passcode: '',
            password: ''
          }
        ],
        conferenceSolution: {
          key: {
            type: 'type'
          },
          name: 'name',
          iconUri: 'https://sample.com'
        },
        conferenceId: 'conferenceId',
        signature: '',
        notes: '',
        gadget: {
          type: 'type',
          title: '',
          link: '',
          iconLink: '',
          width: 100,
          height: 200,
          display: 'display'
        },
      },
      anyoneCanAddSelf: true,
      guestsCanInviteOthers: true,
      guestsCanModify: true,
      guestsCanSeeOtherGuests: false,
      privateCopy: true,
      locked: false,
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'method',
            minutes: 10
          }
        ]
      },
      source: {
        url: '',
        title: ''
      },
      attachments: [
        {
          fileUrl: '',
          title: '',
          mimeType: 'mimeType',
          iconLink: '',
          fileId: 'fileId'
        }
      ]
    }
  ]
}

testMapper(
  'Google apis: Calendar events mapper',
  calendarEventsMapper,
  () => inputEvent,
  () => outputEvent
)

