import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../helpers/mapper.helper'
import { message } from '../common/schema'
import { Message } from '../common/interfaces'

export type UserMessages = {
  '@odata.context': string,
  '@odata.nextLink'?: string,
  value: Message[]
}

const schema: Schema<UserMessages> = {
  '@odata.context': [
    TYPES.Private,
    TYPES.String
  ],
  '@odata.nextLink': TYPES.Url,
  'value': [
    message
  ]
}

export default jsonMapper<typeof schema, UserMessages>(schema)
