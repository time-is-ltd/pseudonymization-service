import userMessageMapper, { UserMessages } from './list-user-messages.mapper'
import {
  PersonId,
  getEmail,
  getAnonymizedEmail,
  testMapper,
  ANONYMIZED_EMAIL
} from '../../../helpers/testing'

jest.mock('../../../helpers/anonymization.helper')

const buildInputEmailAddress = (id: PersonId) => {
  const email = getEmail(id)
  return {
    name: email.name,
    address: email.address
  }
}

const buildOutputEmailAddress = (id: PersonId) => {
  const email = getAnonymizedEmail(id)
  return {
    name: email.name,
    address: email.address
  }
}

const buildInputRecipient = (id: PersonId) => {
  return {
    emailAddress: buildInputEmailAddress(id)
  }
}


const buildOutputRecipient = (id: PersonId) => {
  return {
    emailAddress: buildOutputEmailAddress(id)
  }
}

const message = {
  id: 'MTc0MjM3NjEtYWY5MC00NTAyLWE3MDctYTljZjIwMmM4ZjNlCg==',
  createdDateTime: '2019-11-21T15:09:38Z',
  lastModifiedDateTime: '2019-11-21T15:09:40Z',
  changeKey: 'YjRjMWIxODUtZmZkNy00MDM0LTk3NTYtYzkyNzhhNTdiOTgzCg',
  categories: ['test', 'test2'],
  receivedDateTime: '2019-11-21T15:09:39Z',
  sentDateTime: '2019-11-21T15:09:38Z',
  hasAttachments: false,
  internetMessageId: '<random@random.eurprd99.prod.outlook.com>',
  subject: 'Test subject',
  bodyPreview: 'Test body preview',
  importance: 'normal',
  parentFolderId: 'YzgyYzc0ZmQtNDY0NC00MmI5LWEwYmYtMjVkMzMxM2E4YzM2Cg==',
  conversationId: 'MTM5NjJlNDktNjJkNS00ODA1LTgwM2QtMDMwNmRmYTdiMzc2Cg==',
  conversationIndex: 'OTlhMTgxNTAtYThhMS00MzE1LTkxMWItOGJiNmY0MmNhNjlkCg==',
  isDeliveryReceiptRequested: false,
  isReadReceiptRequested: false,
  isRead: true,
  isDraft: false,
  webLink: 'https://outlook.office365.com/owa/',
  inferenceClassification: 'focused',
  unsubscribeData: 'unsubscribeData',
  unsubscribeEnabled: false,
  mentionsPreview: {
    isMentioned: false
  },
  body: {
    contentType: 'html',
    content: '<html>\r\n<head>\r\n<meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\'>\r\n<meta content=\'text/html; charset=iso-8859-2\'>\r\n<style type=\'text/css\' style=\'display:none\'>\r\n<!--\r\np\r\n\t{margin-top:0;\r\n\tmargin-bottom:0}\r\n-->\r\n</style>\r\n</head>\r\n<body dir=\'ltr\'>\r\n<div style=\'font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt; color:rgb(0,0,0)\'>\r\nTest test</div>\r\n</body>\r\n</html>\r\n'
  },
  sender: buildInputRecipient(1),
  from: buildInputRecipient(2),
  toRecipients: [
    buildInputRecipient(3)
  ],
  ccRecipients: [
    buildInputRecipient(4),
    buildInputRecipient(5)
  ],
  bccRecipients: [
    buildInputRecipient(6)
  ],
  replyTo: [
    buildInputRecipient(7)
  ],
  internetMessageHeaders: [
    {
      name: 'Delivered-To',
      value: getEmail(1).address
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
      value: getEmail(2).address
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
      value: getEmail(3).address
    },
    {
      name: 'References',
      value: 'References value'
    },
    {
      name: 'From',
      value: getEmail(4).address
    },
    {
      name: 'Message-ID',
      value: getEmail(5).address
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
      value: getEmail(6).address
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
  uniqueBody: {
    contentType: 'text/html',
    content: ''
  },
  attachments: [
    {
      contentType: 'text/html',
      id: 'id',
      isInline: true,
      lastModifiedDateTime: 'lastModifiedDateTime',
      name: 'name.csv',
      size: 100
    },
    {
      contentType: 'text/html',
      id: 'id2',
      isInline: false,
      lastModifiedDateTime: 'lastModifiedDateTime',
      name: '',
      size: 0
    }
  ],
  extensions: [
    {
      id: 'id1'
    },
    {
      id: 'id2'
    },
    {
      id: 'id3'
    }
  ],
  mentions: [
    {
      application: 'application',
      clientReference: 'clientReference',
      createdBy: buildInputEmailAddress(1),
      createdDateTime: 'createdDateTime',
      deepLink: 'http://deepLink',
      id: 'id',
      mentioned: buildInputEmailAddress(2),
      mentionText: 'mentionText',
      serverCreatedDateTime: 'serverCreatedDateTime'
    }
  ],
  flag: {
    flagStatus: 'notFlagged',
    completedDateTime: {
      dateTime: 'dateTime',
      timeZone: 'timeZone'
    },
    dueDateTime: {
      dateTime: 'dateTime',
      timeZone: 'timeZone'
    },
    startDateTime: {
      dateTime: 'dateTime',
      timeZone: 'timeZone'
    }
  }
}

const messageOutput = {
  id: 'MTc0MjM3NjEtYWY5MC00NTAyLWE3MDctYTljZjIwMmM4ZjNlCg==',
  createdDateTime: '2019-11-21T15:09:38Z',
  lastModifiedDateTime: '2019-11-21T15:09:40Z',
  changeKey: 'YjRjMWIxODUtZmZkNy00MDM0LTk3NTYtYzkyNzhhNTdiOTgzCg',
  categories: ['test', 'test2'],
  receivedDateTime: '2019-11-21T15:09:39Z',
  sentDateTime: '2019-11-21T15:09:38Z',
  hasAttachments: false,
  internetMessageId: ANONYMIZED_EMAIL,
  subject: '',
  bodyPreview: '',
  importance: 'normal',
  parentFolderId: 'YzgyYzc0ZmQtNDY0NC00MmI5LWEwYmYtMjVkMzMxM2E4YzM2Cg==',
  conversationId: 'MTM5NjJlNDktNjJkNS00ODA1LTgwM2QtMDMwNmRmYTdiMzc2Cg==',
  conversationIndex: 'OTlhMTgxNTAtYThhMS00MzE1LTkxMWItOGJiNmY0MmNhNjlkCg==',
  isDeliveryReceiptRequested: false,
  isReadReceiptRequested: false,
  isRead: true,
  isDraft: false,
  webLink: '',
  inferenceClassification: 'focused',
  unsubscribeData: '',
  unsubscribeEnabled: false,
  mentionsPreview: {
    isMentioned: false
  },
  body: {
    contentType: 'html',
    content: ''
  },
  sender:  buildOutputRecipient(1),
  from: buildOutputRecipient(2),
  toRecipients: [
    buildOutputRecipient(3)
  ],
  ccRecipients: [
    buildOutputRecipient(4),
    buildOutputRecipient(5)
  ],
  bccRecipients: [
    buildOutputRecipient(6)
  ],
  replyTo: [
    buildOutputRecipient(7)
  ],
  internetMessageHeaders: [
    {
      name: 'Delivered-To',
      value: getAnonymizedEmail(1).address
    },
    {
      name: 'To',
      value: getAnonymizedEmail(3).address
    },
    {
      name: 'From',
      value: getAnonymizedEmail(4).address
    },
    {
      name: 'Message-ID',
      value: getAnonymizedEmail(5).address
    },
    {
      name: 'Date',
      value: 'Fri, 15 Feb 2019 12:05:45 +0100'
    },
    {
      name: 'In-Reply-To',
      value: getAnonymizedEmail(6).address
    },
    {
      name: 'Content-Type',
      value: 'multipart/alternative; boundary=\'------------6ED315FEBBCA9EC9B1600C6F\''
    }
  ],
  uniqueBody: {
    contentType: 'text/html',
    content: ''
  },
  attachments: [
    {
      contentType: 'text/html',
      id: 'id',
      isInline: true,
      lastModifiedDateTime: 'lastModifiedDateTime',
      name: 'x.extension',
      size: 100
    },
    {
      contentType: 'text/html',
      id: 'id2',
      isInline: false,
      lastModifiedDateTime: 'lastModifiedDateTime',
      name: 'x.extension',
      size: 0
    }
  ],
  extensions: [
    {
      id: 'id1'
    },
    {
      id: 'id2'
    },
    {
      id: 'id3'
    }
  ],
  mentions: [
    {
      application: 'application',
      clientReference: 'clientReference',
      createdBy: buildOutputEmailAddress(1),
      createdDateTime: 'createdDateTime',
      deepLink: '',
      id: 'id',
      mentioned: buildOutputEmailAddress(2),
      mentionText: '',
      serverCreatedDateTime: 'serverCreatedDateTime'
    }
  ],
  flag: {
    flagStatus: 'notFlagged',
    completedDateTime: {
      dateTime: 'dateTime',
      timeZone: 'timeZone'
    },
    dueDateTime: {
      dateTime: 'dateTime',
      timeZone: 'timeZone'
    },
    startDateTime: {
      dateTime: 'dateTime',
      timeZone: 'timeZone'
    }
  }
}

const buildInput = (messageCount: number = 0): UserMessages => {
  return {
    '@odata.context': `https://graph.microsoft.com/beta/$metadata#users('john.doe%40gmail.com')/messages`,
    '@odata.nextLink': 'test',
    value: Array.from(Array(messageCount)).map(() => message)
  }
}

const buildOutput = (messageCount: number = 0): UserMessages => {
  return {
    '@odata.context': `https://graph.microsoft.com/beta/$metadata#users('john.doe%40gmail.com')/messages`,
    '@odata.nextLink': 'test',
    value: Array.from(Array(messageCount)).map(() => messageOutput)
  }
}

testMapper(
  'MicrosoftGraph: List user messages mapper',
  userMessageMapper,
  buildInput,
  buildOutput
)
