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

const schema: Schema<UserCalendars> = {
  '@odata.context': TYPES.String,
  '@odata.nextLink': TYPES.String,
  value: [
    calendar
  ]
}

export default jsonMapper<typeof schema, UserCalendars>(schema)
