import { type Schema, TYPES } from '../../../mapper'

import {
  type Attachment,
  type Attendee,
  type Calendar,
  type CallRecordsEndpoint,
  type CallRecordSession,
  type DateTimeTimeZone,
  type EmailAddress,
  type Event,
  type Extension,
  type FollowUpFlag,
  type Identity,
  type IdentitySet,
  type InternetMessageHeader,
  type ItemBody,
  type Location,
  type MailFolder,
  type Mention,
  type MentionsPreview,
  type Message,
  type OnlineMeeting,
  type OutlookGeoCoordinates,
  type PatternedRecurrence,
  type Phone,
  type PhysicalAddress,
  type Recipient,
  type RecurrencePattern,
  type RecurrenceRange,
  type ResponseStatus,
  type TimeSlot
} from './interfaces'

export const itemBody: Schema<ItemBody> = {
  contentType: TYPES.ContentType,
  content: TYPES.ExtractedDomains
}

export const dateTimeTimeZone: Schema<DateTimeTimeZone> = {
  dateTime: TYPES.Datetime,
  timeZone: TYPES.String
}

export const physicalAddress: Schema<PhysicalAddress> = {
  city: TYPES.String,
  countryOrRegion: TYPES.String,
  postalCode: TYPES.String,
  postOfficeBox: TYPES.String,
  state: TYPES.String,
  street: TYPES.String,
  type: TYPES.String
}

export const outlookGeoCoordinates: Schema<OutlookGeoCoordinates> = {
  accuracy: TYPES.Number,
  altitude: TYPES.Number,
  altitudeAccuracy: TYPES.Number,
  latitude: TYPES.Number,
  longitude: TYPES.Number
}

export const location: Schema<Location> = {
  address: physicalAddress,
  coordinates: outlookGeoCoordinates,
  displayName: [
    TYPES.String,
    TYPES.Private
  ],
  locationType: TYPES.String,
  locationEmailAddress: TYPES.Email,
  locationUri: [
    TYPES.Url,
    TYPES.Private
  ],
  uniqueId: TYPES.String,
  uniqueIdType: TYPES.String
}

export const emailAddress: Schema<EmailAddress> = {
  name: [
    TYPES.Username,
    TYPES.Private
  ],
  address: TYPES.Email
}

export const responseStatus: Schema<ResponseStatus> = {
  response: TYPES.String,
  time: TYPES.Datetime
}

export const timeSlot: Schema<TimeSlot> = {
  start: dateTimeTimeZone,
  end: dateTimeTimeZone
}

export const attendee: Schema<Attendee> = {
  type: TYPES.String,
  status: responseStatus,
  emailAddress,
  proposedNewTime: timeSlot
}

export const recipient: Schema<Recipient> = {
  emailAddress
}

export const phone: Schema<Phone> = {
  number: [
    TYPES.Private,
    TYPES.String
  ],
  type: TYPES.String
}

export const onlineMeeting: Schema<OnlineMeeting> = {
  conferenceId: TYPES.String,
  joinUrl: TYPES.ExtractedDomains,
  phones: [
    phone
  ],
  quickDial: [
    TYPES.Private,
    TYPES.String
  ],
  tollFreeNumbers: [
    TYPES.String,
    TYPES.Array,
    TYPES.Private
  ],
  tollNumber: [
    TYPES.Private,
    TYPES.String
  ]
}

export const recurrencePattern: Schema<RecurrencePattern> = {
  dayOfMonth: TYPES.Number,
  daysOfWeek: [
    TYPES.String,
    TYPES.Array
  ],
  firstDayOfWeek: TYPES.String,
  index: TYPES.String,
  interval: TYPES.Number,
  month: TYPES.Number,
  type: TYPES.String
}

export const recurrenceRange: Schema<RecurrenceRange> = {
  endDate: TYPES.Datetime,
  numberOfOccurrences: TYPES.Number,
  recurrenceTimeZone: TYPES.String,
  startDate: TYPES.Datetime,
  type: TYPES.String
}

export const patternedRecurrence: Schema<PatternedRecurrence> = {
  pattern: recurrencePattern,
  range: recurrenceRange
}

export const attachment: Schema<Attachment> = {
  contentType: TYPES.ContentType,
  id: TYPES.String,
  isInline: TYPES.Boolean,
  lastModifiedDateTime: TYPES.Datetime,
  name: TYPES.Filename,
  size: TYPES.Number
}

export const extension: Schema<Extension> = {
  id: TYPES.String
}

export const calendar: Schema<Calendar> = {
  id: TYPES.String,
  name: [
    TYPES.Text,
    TYPES.Private
  ],
  color: TYPES.String,
  hexColor: TYPES.String,
  isDefaultCalendar: TYPES.Boolean,
  changeKey: TYPES.String,
  canShare: TYPES.Boolean,
  canViewPrivateItems: TYPES.Boolean,
  isShared: TYPES.Boolean,
  isSharedWithMe: TYPES.Boolean,
  canEdit: TYPES.Boolean,
  allowedOnlineMeetingProviders: [
    TYPES.String,
    TYPES.Array
  ],
  defaultOnlineMeetingProvider: TYPES.String,
  isTallyingResponses: TYPES.Boolean,
  isRemovable: TYPES.Boolean,
  owner: emailAddress
}

export const event: Schema<Event> = {
  id: TYPES.String,
  iCalUId: TYPES.String,
  subject: TYPES.ExtractedDomains,
  bodyPreview: [
    TYPES.Text,
    TYPES.Private
  ],
  body: itemBody,
  categories: [
    TYPES.String,
    TYPES.Array
  ],
  changeKey: TYPES.String,
  start: dateTimeTimeZone,
  end: dateTimeTimeZone,
  location,
  locations: [
    location
  ],
  attendees: [
    attendee
  ],
  organizer: recipient,
  allowNewTimeProposals: TYPES.Boolean,
  createdDateTime: TYPES.Datetime,
  hasAttachments: TYPES.Boolean,
  uid: TYPES.String,
  importance: TYPES.String,
  isAllDay: TYPES.Boolean,
  isCancelled: TYPES.Boolean,
  isDraft: TYPES.Boolean,
  isOnlineMeeting: TYPES.Boolean,
  isOrganizer: TYPES.Boolean,
  isReminderOn: TYPES.Boolean,
  lastModifiedDateTime: TYPES.Datetime,
  onlineMeeting,
  onlineMeetingProvider: TYPES.String,
  onlineMeetingUrl: TYPES.ExtractedDomains,
  originalEndTimeZone: TYPES.Datetime,
  originalStart: TYPES.Datetime,
  originalStartTimeZone: TYPES.String,
  recurrence: patternedRecurrence,
  reminderMinutesBeforeStart: TYPES.Number,
  responseRequested: TYPES.Boolean,
  responseStatus,
  sensitivity: TYPES.String,
  seriesMasterId: TYPES.String,
  showAs: TYPES.String,
  type: TYPES.String,
  webLink: [
    TYPES.Url,
    TYPES.Private
  ],
  attachments: [
    attachment
  ],
  calendar,
  extensions: [
    extension
  ]
}

export const followUpFlag: Schema<FollowUpFlag> = {
  flagStatus: TYPES.String,
  completedDateTime: dateTimeTimeZone,
  dueDateTime: dateTimeTimeZone,
  startDateTime: dateTimeTimeZone
}

export const internetMessageHeader: Schema<InternetMessageHeader> = {
  name: TYPES.String,
  value: TYPES.String
}

export const mentionsPreview: Schema<MentionsPreview> = {
  isMentioned: TYPES.Boolean
}

export const mention: Schema<Mention> = {
  application: TYPES.String,
  clientReference: TYPES.String,
  createdBy: emailAddress,
  createdDateTime: TYPES.Datetime,
  deepLink: [
    TYPES.Url,
    TYPES.Private
  ],
  id: TYPES.String,
  mentioned: emailAddress,
  mentionText: [
    TYPES.Private,
    TYPES.Text
  ],
  serverCreatedDateTime: TYPES.Datetime
}

export const message: Schema<Message> = {
  id: TYPES.Id,
  createdDateTime: TYPES.Datetime,
  lastModifiedDateTime: TYPES.Datetime,
  changeKey: TYPES.Id,
  categories: [
    TYPES.String,
    TYPES.Array
  ],
  receivedDateTime: TYPES.Datetime,
  sentDateTime: TYPES.Datetime,
  hasAttachments: TYPES.Boolean,
  internetMessageId: TYPES.Email,
  subject: [
    TYPES.Text,
    TYPES.Private
  ],
  bodyPreview: [
    TYPES.Text,
    TYPES.Private
  ],
  importance: TYPES.String,
  parentFolderId: TYPES.Id,
  conversationId: TYPES.Id,
  conversationIndex: TYPES.String,
  isDeliveryReceiptRequested: TYPES.Boolean,
  isReadReceiptRequested: TYPES.Boolean,
  isRead: TYPES.Boolean,
  isDraft: TYPES.Boolean,
  webLink: [
    TYPES.Url,
    TYPES.Private
  ],
  inferenceClassification: TYPES.String,
  unsubscribeData: [
    TYPES.String,
    TYPES.Private
  ],
  unsubscribeEnabled: TYPES.Boolean,
  mentionsPreview: {
    isMentioned: TYPES.Boolean
  },
  body: itemBody,
  uniqueBody: itemBody,
  sender: recipient,
  from: recipient,
  toRecipients: [
    recipient
  ],
  ccRecipients: [
    recipient
  ],
  bccRecipients: [
    recipient
  ],
  replyTo: [
    recipient
  ],
  mentions: [
    mention
  ],
  attachments: [
    attachment
  ],
  extensions: [
    extension
  ],
  // @see: https://tools.ietf.org/html/rfc2822
  internetMessageHeaders: [
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
  flag: followUpFlag
}

export const identitySchema: Schema<Identity> = {
  displayName: [TYPES.Private, TYPES.String],
  id: TYPES.String,
  tenantId: TYPES.String
}

export const identitySetSchema: Schema<IdentitySet> = {
  application: identitySchema,
  applicationInstance: identitySchema,
  device: identitySchema,
  user: identitySchema,
  conversation: identitySchema,
  conversationIdentityType: identitySchema,
  encrypted: identitySchema,
  guest: identitySchema,
  phone: identitySchema,
  acsUser: identitySchema,
  spoolUser: identitySchema,
  onPremises: identitySchema,
  acsApplicationInstance: identitySchema,
  spoolApplicationInstance: identitySchema
}

export const callRecordsEndpointSchema: Schema<CallRecordsEndpoint> = {
  identity: identitySetSchema
}

export const callRecordsSessionSchema: Schema<CallRecordSession> = {
  id: TYPES.String,
  caller: callRecordsEndpointSchema,
  callee: callRecordsEndpointSchema,
  failureInfo: {
    reason: TYPES.String,
    stage: TYPES.String
  },
  modalities: [TYPES.Array, TYPES.String],
  startDateTime: TYPES.String,
  endDateTime: TYPES.String
}

export const mailFolderSchema: Schema<MailFolder> = {
  childFolderCount: TYPES.Number,
  displayName: [TYPES.Private, TYPES.String],
  id: TYPES.String,
  isHidden: TYPES.Boolean,
  parentFolderId: TYPES.String,
  totalItemCount: [TYPES.Private, TYPES.Number],
  unreadItemCount: [TYPES.Private, TYPES.Number]
}
