import listUserEventsMapper, { UserEvents } from './list-user-events.mapper'
import {
  PersonId,
  getEmail,
  getAnonymizedEmail,
  testMapper,
  ANONYMIZED_EMAIL
} from '../../../helpers/testing'

jest.mock('../../../anonymizer')

const buildInputEmailAddress = (id: PersonId) => {
  const email = getEmail(id)
  return {
    name: email.name,
    address: email.address
  }
}

const buildOutputEmailAddress = (id: PersonId) => {
  const email = getAnonymizedEmail(id)
  return {
    name: email.name,
    address: email.address
  }
}

const event = {
  allowNewTimeProposals: true,
  attendees: [
    {
      emailAddress: buildInputEmailAddress(1),
      proposedNewTime: {
        start: {
          dateTime: 'dateTime',
          timeZone: 'timeZone'
        },
        end: {
          dateTime: 'dateTime',
          timeZone: 'timeZone'
        }
      },
      status: {
        response: 'response',
        time: 'time'
      },
      type: 'String'
    }
  ],
  body: {
    contentType: 'contentType',
    content: 'content'
  },
  bodyPreview: 'string',
  categories: ['string', 'string2'],
  changeKey: 'string',
  createdDateTime: 'String (timestamp)',
  end: {
    dateTime: 'dateTime',
    timeZone: 'timeZone'
  },
  hasAttachments: true,
  uid: 'string',
  iCalUId: 'string',
  id: 'string (identifier)',
  importance: 'String',
  isAllDay: true,
  isCancelled: true,
  isDraft: false,
  isOnlineMeeting: true,
  isOrganizer: true,
  isReminderOn: true,
  lastModifiedDateTime: 'String (timestamp)',
  location: {
    address: {
      city: 'city',
      countryOrRegion: 'countryOrRegion',
      postalCode: 'postalCode',
      postOfficeBox: 'postOfficeBox',
      state: 'state',
      street: 'street',
      type: 'type'
    },
    coordinates: {
      accuracy: 100,
      altitude: 20,
      altitudeAccuracy: 10,
      latitude: 10,
      longitude: 30
    },
    displayName: 'displayName',
    locationType: 'locationType',
    locationEmailAddress: 'locationEmailAddress',
    locationUri: getEmail(1).address,
    uniqueId: 'uniqueId',
    uniqueIdType: 'uniqueIdType'
  },
  locations: [
    {
      address: {
        city: 'city',
        countryOrRegion: 'countryOrRegion',
        postalCode: 'postalCode',
        postOfficeBox: 'postOfficeBox',
        state: 'state',
        street: 'street',
        type: 'type'
      },
      coordinates: {
        accuracy: 100,
        altitude: 20,
        altitudeAccuracy: 10,
        latitude: 10,
        longitude: 30
      },
      displayName: 'displayName',
      locationType: 'locationType',
      locationEmailAddress: getEmail(2).address,
      locationUri: 'locationUri',
      uniqueId: 'uniqueId',
      uniqueIdType: 'uniqueIdType'
    },
    {
      address: {
        city: 'city',
        countryOrRegion: 'countryOrRegion',
        postalCode: 'postalCode',
        postOfficeBox: 'postOfficeBox',
        state: 'state',
        street: 'street',
        type: 'type'
      },
      coordinates: {
        accuracy: 100,
        altitude: 20,
        altitudeAccuracy: 10,
        latitude: 10,
        longitude: 30
      },
      displayName: 'displayName',
      locationType: 'locationType',
      locationEmailAddress: getEmail(1).address,
      locationUri: 'locationUri',
      uniqueId: 'uniqueId',
      uniqueIdType: 'uniqueIdType'
    }
  ],
  onlineMeeting: {
    conferenceId: 'conferenceId',
    joinUrl: 'joinUrl',
    phones: [
      {
        number: 'number',
        type: 'type'
      }
    ],
    quickDial: 'quickDial',
    tollFreeNumbers: ['tollFreeNumbers', 'tollFreeNumbers2'],
    tollNumber: 'tollNumber'
  },
  onlineMeetingProvider: 'string',
  onlineMeetingUrl: 'string',
  organizer:  {
    emailAddress: buildInputEmailAddress(2)
  },
  originalEndTimeZone: 'string',
  originalStart: 'String (timestamp)',
  originalStartTimeZone: 'string',
  recurrence: {
    pattern: {
      dayOfMonth: 1,
      daysOfWeek: ['mo', 'fr'],
      firstDayOfWeek: 'mo',
      index: 'index',
      interval: 3,
      month: 11,
      type: 'type'
    },
    range: {
      endDate: 'endDate',
      numberOfOccurrences: 3,
      recurrenceTimeZone: 'recurrenceTimeZone',
      startDate: 'startDate',
      type: 'type'
    }
  },
  reminderMinutesBeforeStart: 1024,
  responseRequested: true,
  responseStatus: {
    response: 'response',
    time: 'time'
  },
  sensitivity: 'String',
  seriesMasterId: 'string',
  showAs: 'String',
  start: {
    dateTime: 'dateTime',
    timeZone: 'timeZone'
  },
  subject: 'string',
  type: 'String',
  webLink: 'string',
  attachments: [
    {
      contentType: 'contentType',
      id: 'id',
      isInline: true,
      lastModifiedDateTime: 'lastModifiedDateTime',
      name: 'name',
      size: 100
    },
    {
      contentType: 'contentType',
      id: 'id',
      isInline: true,
      lastModifiedDateTime: 'lastModifiedDateTime',
      name: 'name',
      size: 100
    }
  ],
  extensions: [
    {
      id: 'id1'
    },
    {
      id: 'id2'
    }
  ]
}

const eventOutput = {
  allowNewTimeProposals: true,
  attendees: [
    {
      emailAddress: buildOutputEmailAddress(1),
      proposedNewTime: {
        start: {
          dateTime: 'dateTime',
          timeZone: 'timeZone'
        },
        end: {
          dateTime: 'dateTime',
          timeZone: 'timeZone'
        }
      },
      status: {
        response: 'response',
        time: 'time'
      },
      type: 'String'
    }
  ],
  body: {
    contentType: 'contentType',
    content: ''
  },
  bodyPreview: '',
  categories: ['string', 'string2'],
  changeKey: 'string',
  createdDateTime: 'String (timestamp)',
  end: {
    dateTime: 'dateTime',
    timeZone: 'timeZone'
  },
  hasAttachments: true,
  uid: 'string',
  iCalUId: 'string',
  id: 'string (identifier)',
  importance: 'String',
  isAllDay: true,
  isCancelled: true,
  isDraft: false,
  isOnlineMeeting: true,
  isOrganizer: true,
  isReminderOn: true,
  lastModifiedDateTime: 'String (timestamp)',
  location: {
    address: {
      city: 'city',
      countryOrRegion: 'countryOrRegion',
      postalCode: 'postalCode',
      postOfficeBox: 'postOfficeBox',
      state: 'state',
      street: 'street',
      type: 'type'
    },
    coordinates: {
      accuracy: 100,
      altitude: 20,
      altitudeAccuracy: 10,
      latitude: 10,
      longitude: 30
    },
    displayName: '',
    locationType: 'locationType',
    locationEmailAddress: getAnonymizedEmail(1).address,
    locationUri: '',
    uniqueId: 'uniqueId',
    uniqueIdType: 'uniqueIdType'
  },
  locations: [
    {
      address: {
        city: 'city',
        countryOrRegion: 'countryOrRegion',
        postalCode: 'postalCode',
        postOfficeBox: 'postOfficeBox',
        state: 'state',
        street: 'street',
        type: 'type'
      },
      coordinates: {
        accuracy: 100,
        altitude: 20,
        altitudeAccuracy: 10,
        latitude: 10,
        longitude: 30
      },
      displayName: '',
      locationType: 'locationType',
      locationEmailAddress: getAnonymizedEmail(2).address,
      locationUri: '',
      uniqueId: 'uniqueId',
      uniqueIdType: 'uniqueIdType'
    },
    {
      address: {
        city: 'city',
        countryOrRegion: 'countryOrRegion',
        postalCode: 'postalCode',
        postOfficeBox: 'postOfficeBox',
        state: 'state',
        street: 'street',
        type: 'type'
      },
      coordinates: {
        accuracy: 100,
        altitude: 20,
        altitudeAccuracy: 10,
        latitude: 10,
        longitude: 30
      },
      displayName: '',
      locationType: 'locationType',
      locationEmailAddress: getAnonymizedEmail(1).address,
      locationUri: '',
      uniqueId: 'uniqueId',
      uniqueIdType: 'uniqueIdType'
    }
  ],
  onlineMeeting: {
    conferenceId: 'conferenceId',
    joinUrl: '',
    phones: [
      {
        number: '',
        type: 'type'
      }
    ],
    quickDial: '',
    tollFreeNumbers: [],
    tollNumber: ''
  },
  onlineMeetingProvider: 'string',
  onlineMeetingUrl: '',
  organizer:  {
    emailAddress: buildOutputEmailAddress(2)
  },
  originalEndTimeZone: 'string',
  originalStart: 'String (timestamp)',
  originalStartTimeZone: 'string',
  recurrence: {
    pattern: {
      dayOfMonth: 1,
      daysOfWeek: ['mo', 'fr'],
      firstDayOfWeek: 'mo',
      index: 'index',
      interval: 3,
      month: 11,
      type: 'type'
    },
    range: {
      endDate: 'endDate',
      numberOfOccurrences: 3,
      recurrenceTimeZone: 'recurrenceTimeZone',
      startDate: 'startDate',
      type: 'type'
    }
  },
  reminderMinutesBeforeStart: 1024,
  responseRequested: true,
  responseStatus: {
    response: 'response',
    time: 'time'
  },
  sensitivity: 'String',
  seriesMasterId: 'string',
  showAs: 'String',
  start: {
    dateTime: 'dateTime',
    timeZone: 'timeZone'
  },
  subject: '',
  type: 'String',
  webLink: '',
  attachments: [
    {
      contentType: 'contentType',
      id: 'id',
      isInline: true,
      lastModifiedDateTime: 'lastModifiedDateTime',
      name: 'x.extension',
      size: 100
    },
    {
      contentType: 'contentType',
      id: 'id',
      isInline: true,
      lastModifiedDateTime: 'lastModifiedDateTime',
      name: 'x.extension',
      size: 100
    }
  ],
  extensions: [
    {
      id: 'id1'
    },
    {
      id: 'id2'
    }
  ]
}

const buildInput = (messageCount: number = 0): UserEvents => {
  return {
    '@odata.context': ``,
    '@odata.nextLink': 'test',
    value: Array.from(Array(messageCount)).map(() => event)
  }
}

const buildOutput = (messageCount: number = 0): UserEvents => {
  return {
    '@odata.context': ``,
    '@odata.nextLink': 'test',
    value: Array.from(Array(messageCount)).map(() => eventOutput)
  }
}

testMapper(
  'MicosoftGraph: List user events mapper',
  listUserEventsMapper,
  buildInput,
  buildOutput
)
