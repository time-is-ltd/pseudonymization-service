import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../helpers/mapper.helper'

export type UserMessageItem = {
  id: string,
  threadId: string
}

export type UserMessages = {
  messages: UserMessageItem[],
  nextPageToken: string,
  resultSizeEstimate: string
}

const schema: Schema<UserMessages> = {
  messages: [
    {
      id: TYPES.String,
      threadId: TYPES.String
    }
  ],
  nextPageToken: TYPES.String,
  resultSizeEstimate: TYPES.String
}

export const listUserMessagesMapper = jsonMapper<typeof schema, UserMessages>(schema)
