import { getUserMessageMapper } from './get-user-message.mapper'
import {
  PersonId,
  getEmail,
  getAnonymizedEmail,
  ANONYMIZED_FILENAME,
  testMapper
} from '../../../helpers/testing'

jest.mock('../../../anonymizer')

const buildInputEmail = (id: PersonId) => {
  const email = getEmail(id)
  return email.toString()
}

const buildOutputEmail = (id: PersonId) => {
  const email = getAnonymizedEmail(id)
  return email.toString()
}

const message = {
  id: 'id',
  threadId: 'threadId',
  labelIds: [
    'IMPORTANT',
    'CATEGORY_PERSONAL'
  ],
  snippet: 'Example snippet',
  historyId: '1234567',
  internalDate: '1550228745000',
  payload: {
    partId: '',
    mimeType: 'multipart/alternative',
    filename: '',
    headers: [
      {
        name: 'Delivered-To',
        value: buildInputEmail(1)
      },
      {
        name: 'Received',
        value: 'received value'
      },
      {
        name: 'X-Google-Smtp-Source',
        value: 'X-Google-Smtp-Source value'
      },
      {
        name: 'X-Received',
        value: 'X-Received value'
      },
      {
        name: 'ARC-Seal',
        value: 'ARC-Seal value'
      },
      {
        name: 'ARC-Message-Signature',
        value: 'ARC-Message-Signature value'
      },
      {
        name: 'ARC-Authentication-Results',
        value: 'ARC-Authentication-Results value'
      },
      {
        name: 'Return-Path',
        value: buildInputEmail(2)
      },
      {
        name: 'Received-SPF',
        value: 'Received-SPF value'
      },
      {
        name: 'Authentication-Results',
        value: 'Authentication-Results value'
      },
      {
        name: 'Received',
        value: 'Received value'
      },
      {
        name: 'Received',
        value: 'Received value'
      },
      {
        name: 'Subject',
        value: 'Subject value'
      },
      {
        name: 'To',
        value: buildInputEmail(3)
      },
      {
        name: 'References',
        value: 'References value'
      },
      {
        name: 'From',
        value: buildInputEmail(4)
      },
      {
        name: 'Message-ID',
        value: buildInputEmail(5)
      },
      {
        name: 'Date',
        value: 'Fri, 15 Feb 2019 12:05:45 +0100'
      },
      {
        name: 'User-Agent',
        value: 'Mozilla/5.0 (Windows NT 6.1; rv:60.0) Gecko/20100101 Thunderbird/60.5.0'
      },
      {
        name: 'MIME-Version',
        value: '1.0'
      },
      {
        name: 'In-Reply-To',
        value: buildInputEmail(6)
      },
      {
        name: 'Content-Type',
        value: 'multipart/alternative; boundary=\'------------6ED315FEBBCA9EC9B1600C6F\''
      },
      {
        name: 'Content-Language',
        value: 'cs'
      }
    ],
    body: {
      size: 0,
      attachmentId: 'attachmentId',
      data: 'data'
    },
    'parts': [
      {
        partId: '0',
        mimeType: 'text/plain',
        filename: '',
        headers: [
          {
            name: 'Content-Type',
            value: 'text/plain; charset=\'utf-8\'; format=flowed'
          },
          {
            name: 'Content-Transfer-Encoding',
            value: '8bit'
          }
        ],
        body: {
          size: 619,
          attachmentId: 'attachmentId',
          data: 'example data'
        }
      },
      {
        partId: '1',
        mimeType: 'text/html',
        filename: '',
        headers: [
          {
            name: 'Content-Type',
            value: 'text/html; charset=\'utf-8\''
          },
          {
            name: 'Content-Transfer-Encoding',
            value: '8bit'
          }
        ],
        body: {
          size: 1504,
          data: 'example data'
        }
      },
      {
        partId: '2',
        mimeType: 'text/plain',
        filename: 'test.jpg'
      }
    ]
  },
  sizeEstimate: 6720
}

const messageOutput = {
  id: 'id',
  threadId: 'threadId',
  labelIds: [
    'IMPORTANT',
    'CATEGORY_PERSONAL'
  ],
  snippet: '',
  historyId: '1234567',
  internalDate: '1550228745000',
  payload: {
    partId: '',
    mimeType: 'multipart/alternative',
    filename: ANONYMIZED_FILENAME,
    headers: [
      {
        name: 'Delivered-To',
        value: buildOutputEmail(1)
      },
      {
        name: 'To',
        value: buildOutputEmail(3)
      },
      {
        name: 'References',
        value: 'References value'
      },
      {
        name: 'From',
        value: buildOutputEmail(4)
      },
      {
        name: 'Message-ID',
        value: buildOutputEmail(5)
      },
      {
        name: 'Date',
        value: 'Fri, 15 Feb 2019 12:05:45 +0100'
      },
      {
        name: 'In-Reply-To',
        value: buildOutputEmail(6)
      },
      {
        name: 'Content-Type',
        value: 'multipart/alternative; boundary=\'------------6ED315FEBBCA9EC9B1600C6F\''
      }
    ],
    body: {
      size: 0,
      attachmentId: 'attachmentId',
      data: ''
    },
    'parts': [
      {
        partId: '0',
        mimeType: 'text/plain',
        filename: ANONYMIZED_FILENAME,
        headers: [
          {
            name: 'Content-Type',
            value: 'text/plain; charset=\'utf-8\'; format=flowed'
          }
        ],
        body: {
          size: 619,
          attachmentId: 'attachmentId',
          data: ''
        }
      },
      {
        partId: '1',
        mimeType: 'text/html',
        filename: ANONYMIZED_FILENAME,
        headers: [
          {
            name: 'Content-Type',
            value: 'text/html; charset=\'utf-8\''
          }
        ],
        body: {
          size: 1504,
          data: ''
        }
      },
      {
        partId: '2',
        mimeType: 'text/plain',
        filename: ANONYMIZED_FILENAME
      }
    ]
  },
  sizeEstimate: 6720
}

testMapper(
  'Google apis: User message mapper',
  getUserMessageMapper,
  () => message,
  () => messageOutput
)
