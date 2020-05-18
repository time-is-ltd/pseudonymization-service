import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../helpers/mapper.helper'
import { Event } from '../common/interfaces'
import { event } from '../common/schema'

export type UserEvents = {
  '@odata.context': string,
  '@odata.nextLink': string,
  value: Event[]
}

const schema: (
  anonymizeCalendarSummary: boolean,
  anonymizeCalendarDescription: boolean
) => Schema<UserEvents> = (
  anonymizeCalendarSummary: boolean,
  anonymizeCalendarDescription: boolean
) => ( {
  '@odata.context': TYPES.String,
  '@odata.nextLink': TYPES.Url,
  value: [
    event(anonymizeCalendarSummary, anonymizeCalendarDescription)
  ]
})

export default (
  anonymizeCalendarSummary: boolean,
  anonymizeCalendarDescription: boolean
) => jsonMapper<typeof schema, UserEvents>(schema(anonymizeCalendarSummary, anonymizeCalendarDescription))
