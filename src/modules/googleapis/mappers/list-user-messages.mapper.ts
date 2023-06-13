import {
  jsonMapper,
  TYPES,
  type Schema
} from '../../../mapper'

export interface UserMessageItem {
  id: string
  threadId: string
}

export interface UserMessages {
  messages: UserMessageItem[]
  nextPageToken: string
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

export const listUserMessagesMapper = jsonMapper<UserMessages>(schema)
