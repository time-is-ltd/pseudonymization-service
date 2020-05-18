import userMessagesMapperFactory, {
  UserCalendars
} from './list-user-calendars.mapper'

import {
  testMapper
} from '../../../helpers/testing'

const buildInputMessage = (messageCount: number = 0): UserCalendars => {
  return {
    kind: 'calendar#calendarList',
    etag: '\"p329eh0casdec0c\"',
    items: Array.from(Array(messageCount)).map((_, i) => ({
      id: `id${i}`,
      kind: 'calendar#calendarListEntry',
      etag: '\'1552555992370000\'',
      summary: 'summary',
      description: 'description',
      location: 'location',
      timeZone: 'America/New_York',
      summaryOverride: 'summaryOverride',
      colorId: '14',
      backgroundColor: '#9fe1e7',
      foregroundColor: '#000000',
      hidden: false,
      selected: true,
      accessRole: 'owner',
      defaultReminders: [
        {
          method: 'popup',
          minutes: 10
        }
      ],
      notificationSettings: {
        notifications: [
          {
            type: 'eventCreation',
            method: 'email'
          },
          {
            type: 'eventChange',
            method: 'email'
          },
          {
            type: 'eventCancellation',
            method: 'email'
          },
          {
            type: 'eventResponse',
            method: 'email'
          }
        ]
      },
      primary: true,
      deleted: false,
      conferenceProperties: {
        allowedConferenceSolutionTypes: [
          'hangoutsMeet'
        ]
      }
    })),
    nextPageToken: 'token',
    resultSizeEstimate: '12'
  }
}

const buildOutputMessage = (anonymizeDescription = true, anonymizeSummary = true) => (messageCount: number = 0): UserCalendars => {
  return {
    kind: 'calendar#calendarList',
    etag: '\"p329eh0casdec0c\"',
    items: Array.from(Array(messageCount)).map((_, i) => ({
      id: `id${i}`,
      kind: 'calendar#calendarListEntry',
      etag: '\'1552555992370000\'',
      summary: anonymizeSummary === true ? '' : 'summary',
      description: anonymizeDescription === true ? '' : 'description',
      location: 'location',
      timeZone: 'America/New_York',
      summaryOverride: '',
      colorId: '14',
      backgroundColor: '#9fe1e7',
      foregroundColor: '#000000',
      hidden: false,
      selected: true,
      accessRole: 'owner',
      defaultReminders: [
        {
          method: 'popup',
          minutes: 10
        }
      ],
      notificationSettings: {
        notifications: [
          {
            type: 'eventCreation',
            method: 'email'
          },
          {
            type: 'eventChange',
            method: 'email'
          },
          {
            type: 'eventCancellation',
            method: 'email'
          },
          {
            type: 'eventResponse',
            method: 'email'
          }
        ]
      },
      primary: true,
      deleted: false,
      conferenceProperties: {
        allowedConferenceSolutionTypes: [
          'hangoutsMeet'
        ]
      }
    })),
    nextPageToken: 'token',
    resultSizeEstimate: '12'
  }
}

testMapper(
  'Google apis: List user calendars mapper - anonymize summary and description',
  userMessagesMapperFactory(true, true),
  buildInputMessage,
  buildOutputMessage(true, true)
)

testMapper(
  'Google apis: List user calendars - anonymize summary',
  userMessagesMapperFactory(false, true),
  buildInputMessage,
  buildOutputMessage(false, true)
)

testMapper(
  'Google apis: List user calendars - anonymize description',
  userMessagesMapperFactory(true, false),
  buildInputMessage,
  buildOutputMessage(true, false)
)

testMapper(
  'Google apis: List user calendars - do not anonymize description and summary',
  userMessagesMapperFactory(false, false),
  buildInputMessage,
  buildOutputMessage(false, false)
)
