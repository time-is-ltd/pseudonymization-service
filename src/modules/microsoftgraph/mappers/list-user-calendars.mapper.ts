import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../helpers/mapper.helper'
import { Calendar } from '../common/interfaces'
import { calendar } from '../common/schema'

export type UserCalendars = {
  '@odata.context': string,
  '@odata.nextLink'?: string,
  value: Calendar[]
}

const schema: (
  anonymizeCalendarSummary: boolean
) => Schema<UserCalendars> = (
  anonymizeCalendarSummary: boolean
) => ({
  '@odata.context': TYPES.String,
  '@odata.nextLink': TYPES.String,
  value: [
    calendar(anonymizeCalendarSummary)
  ]
})

export default (
  anonymizeCalendarSummary: boolean
) => jsonMapper<typeof schema, UserCalendars>(schema(anonymizeCalendarSummary))
