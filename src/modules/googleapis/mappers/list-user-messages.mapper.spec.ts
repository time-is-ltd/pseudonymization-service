import {
  listUserMessagesMapper,
  UserMessages
} from './list-user-messages.mapper'

import {
  testMapper
} from '../../../helpers/testing'

const buildMessage = (messageCount: number = 0): UserMessages => {
  return {
    messages: Array.from(Array(messageCount)).map((_, i) => ({
      id: `id${i}`,
      threadId: `threadId${i}`
    })),
    nextPageToken: 'token',
    resultSizeEstimate: '12'
  }
}

testMapper(
  'Google apis: User messages mapper',
  listUserMessagesMapper,
  buildMessage,
  buildMessage
)
