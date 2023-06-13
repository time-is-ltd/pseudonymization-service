import {
  jsonMapper,
  TYPES,
  type Schema
} from '../../../mapper'

export interface UserMessagePayloadHeader {
  name: string
  value: string
}

export interface UserMessagePayloadPart {
  partId: string
  mimeType: string
  filename: string
  headers: UserMessagePayloadHeader[]
  body: {
    size: number
    attachmentId?: string
    data?: string
  }
}

export interface UserMessagePayload {
  partId: string
  mimeType: string
  filename: string
  headers: UserMessagePayloadHeader[]
  body: {
    size: number
    attachmentId?: string
    data?: string
  }
  parts: UserMessagePayloadPart[]
}

export interface UserMessage {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  historyId: string
  internalDate: string
  payload?: UserMessagePayload
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
        name: 'references',
        value: TYPES.String
      },
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
        value: TYPES.ContentType
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
            value: TYPES.ContentType
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

export const getUserMessageMapper = jsonMapper<Partial<UserMessage>>(schema)
