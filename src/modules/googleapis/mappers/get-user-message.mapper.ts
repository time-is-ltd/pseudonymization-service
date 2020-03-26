import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../helpers/mapper.helper'

export type UserMessagePayloadHeader = {
  name: string,
  value: string
}

export type UserMessagePayloadPart = {
  partId: string,
  mimeType: string,
  filename: string,
  headers: UserMessagePayloadHeader[],
  body: {
    size: number,
    attachmentId?: string,
    data?: string
  }
}

export type UserMessagePayload = {
  partId: string,
  mimeType: string,
  filename: string,
  headers: UserMessagePayloadHeader[],
  body: {
    size: number,
    attachmentId?: string,
    data?: string
  },
  parts: UserMessagePayloadPart[]
}

export type UserMessage = {
  id: string,
  threadId: string,
  labelIds: string[],
  snippet: string,
  historyId: string,
  internalDate: string,
  payload?: UserMessagePayload,
  sizeEstimate: number
}

const schema: Schema<UserMessage> = {
  id: TYPES.String,
  threadId: TYPES.String,
  labelIds: [
    TYPES.String,
    TYPES.Array
  ],
  snippet: [
    TYPES.Text,
    TYPES.Private
  ],
  historyId: TYPES.String,
  internalDate: TYPES.Datetime,
  payload: {
    partId: TYPES.String,
    mimeType: TYPES.String,
    filename: TYPES.Filename,
    // @see: https://tools.ietf.org/html/rfc2822
    headers: [
      {
        name: 'delivered-to',
        value: TYPES.Email
      },
      {
        name: 'message-id',
        value: TYPES.Email
      },
      {
        name: 'reply-to',
        value: TYPES.Email
      },
      {
        name: 'sender',
        value: TYPES.Email
      },
      {
        name: 'cc',
        value: TYPES.Email
      },
      {
        name: 'bcc',
        value: TYPES.Email
      },
      {
        name: 'from',
        value: TYPES.Email
      },
      {
        name: 'to',
        value: TYPES.Email
      },
      {
        name: 'resent-from',
        value: TYPES.Email
      },
      {
        name: 'resent-to',
        value: TYPES.Email
      },
      {
        name: 'resent-sender',
        value: TYPES.Email
      },
      {
        name: 'resent-cc',
        value: TYPES.Email
      },
      {
        name: 'bcc',
        value: TYPES.Email
      },
      {
        name: 'resent-bcc',
        value: TYPES.Email
      },
      {
        name: 'in-reply-to',
        value: TYPES.Email
      },
      {
        name: 'resent-msg-id',
        value: TYPES.String
      },
      {
        name: 'resent-message-id',
        value: TYPES.String
      },
      {
        name: 'resent-date',
        value: TYPES.String
      },
      {
        name: 'date',
        value: TYPES.String
      },
      {
        name: 'content-type',
        value: TYPES.String
      }
    ],
    body: {
      size: TYPES.Number,
      attachmentId: TYPES.String,
      data: [
        TYPES.Text,
        TYPES.Private
      ]
    },
    parts: [
      {
        partId: TYPES.String,
        mimeType: TYPES.String,
        filename: TYPES.Filename,
        headers: [
          {
            name: 'content-type',
            value: TYPES.String
          }
        ],
        body: {
          size: TYPES.Number,
          attachmentId: TYPES.String,
          data: [
            TYPES.Text,
            TYPES.Private
          ]
        }
      }
    ]
  },
  sizeEstimate: TYPES.Number
}

export default jsonMapper<typeof schema, Partial<UserMessage>>(schema)
