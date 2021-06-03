import { listUserCalendarsMapper } from './list-user-calendars.mapper'
import {
  PersonId,
  getEmail,
  getAnonymizedEmail,
  testMapper
} from '../../../helpers/testing'

jest.mock('../../../anonymizer')

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

const calendarOutput = {
  id: 'MTc0MjM3NjEtYWY5MC00NTAyLWE3MDctYTljZjIwMmM4ZjNlCg==',
  name: '',
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
}

const buildInput = (messageCount: number = 0) => {
  return {
    '@odata.context': `context`,
    '@odata.nextLink': 'test',
    'value': Array.from(Array(messageCount)).map(() => calendar)
  }
}

const buildOutput = (messageCount: number = 0) => {
  return {
    '@odata.context': ``,
    '@odata.nextLink': 'test',
    'value': Array.from(Array(messageCount)).map(() => calendarOutput)
  }
}

testMapper(
  'MicosoftGraph: List user calendars mapper',
  listUserCalendarsMapper,
  buildInput,
  buildOutput
)
