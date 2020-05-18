import userCalendarsMapper from './list-user-calendars.mapper'
import {
  PersonId,
  getEmail,
  getAnonymizedEmail,
  testMapper
} from '../../../helpers/testing'

jest.mock('../../../helpers/anonymization.helper')

const buildInputOwner = (id: PersonId) => {
  const email = getEmail(id)
  return {
    name: email.name,
    address: email.address
  }
}

const buildOutputOwner = (id: PersonId) => {
  const email = getAnonymizedEmail(id)
  return {
    name: email.name,
    address: email.address
  }
}

const calendar = {
  id: 'MTc0MjM3NjEtYWY5MC00NTAyLWE3MDctYTljZjIwMmM4ZjNlCg==',
  name: 'Calendar',
  color: 'black',
  hexColor: '000000',
  isDefaultCalendar: true,
  changeKey: 'changeKey',
  canShare: true,
  canViewPrivateItems: false,
  isShared: false,
  isSharedWithMe: true,
  canEdit: true,
  allowedOnlineMeetingProviders: ['provider', 'provider2'],
  defaultOnlineMeetingProvider: 'provider',
  isTallyingResponses: false,
  isRemovable: false,
  owner: buildInputOwner(1)
}

const calendarOutput = (anonymizeCalendarSummary: boolean) => ({
  id: 'MTc0MjM3NjEtYWY5MC00NTAyLWE3MDctYTljZjIwMmM4ZjNlCg==',
  name: anonymizeCalendarSummary ? '' : 'Calendar',
  color: 'black',
  hexColor: '000000',
  isDefaultCalendar: true,
  changeKey: 'changeKey',
  canShare: true,
  canViewPrivateItems: false,
  isShared: false,
  isSharedWithMe: true,
  canEdit: true,
  allowedOnlineMeetingProviders: ['provider', 'provider2'],
  defaultOnlineMeetingProvider: 'provider',
  isTallyingResponses: false,
  isRemovable: false,
  owner: buildOutputOwner(1)
})

const buildInput = (messageCount: number = 0) => {
  return {
    '@odata.context': `context`,
    '@odata.nextLink': 'test',
    'value': Array.from(Array(messageCount)).map(() => calendar)
  }
}

const buildOutput = (anonymizeCalendarSummary: boolean) => (messageCount: number = 0) => {
  return {
    '@odata.context': `context`,
    '@odata.nextLink': 'test',
    'value': Array.from(Array(messageCount)).map(() => calendarOutput(anonymizeCalendarSummary))
  }
}

testMapper(
  'MicrosoftGraph: List user calendars mapper - anonymize calendar name',
  userCalendarsMapper(true),
  buildInput,
  buildOutput(true)
)

testMapper(
  'MicrosoftGraph: List user calendars mapper - do not anonymize calendar name',
  userCalendarsMapper(false),
  buildInput,
  buildOutput(false)
)
