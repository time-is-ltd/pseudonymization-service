import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../helpers/mapper.helper'

export type UserMessage = {
  id: string,
  threadId: string
}

export type UserMessages = {
  messages: UserMessage[],
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

export default jsonMapper<typeof schema, UserMessages>(schema)
