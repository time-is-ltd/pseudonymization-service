import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../mapper'
import { message } from '../common/schema'
import { Message } from '../common/interfaces'

export interface UserMessages {
  '@odata.context': string
  '@odata.nextLink'?: string
  value: Message[]
}

const schema: Schema<UserMessages> = {
  '@odata.context': [
    TYPES.Private,
    TYPES.String
  ],
  '@odata.nextLink': [
    TYPES.Url,
    TYPES.Proxify
  ],
  value: [
    message
  ]
}

export const listUserMessagesMapper = jsonMapper<typeof schema, UserMessages>(schema)
