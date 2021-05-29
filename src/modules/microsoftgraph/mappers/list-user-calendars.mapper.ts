import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../mapper'
import { Calendar } from '../common/interfaces'
import { calendar } from '../common/schema'

export type UserCalendars = {
  '@odata.context': string,
  '@odata.nextLink'?: string,
  value: Calendar[]
}

const schema: Schema<UserCalendars> = {
  '@odata.context': [
    TYPES.Private,
    TYPES.String
  ],
  '@odata.nextLink': [
    TYPES.Url,
    TYPES.Proxify
  ],
  value: [
    calendar
  ]
}

export default jsonMapper<typeof schema, UserCalendars>(schema)
