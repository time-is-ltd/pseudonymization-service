
export type ItemBody = {
  contentType: string,
  content: string
}

export type DateTimeTimeZone = {
  dateTime: string,
  timeZone: string
}

export type PhysicalAddress = {
  city: string
  countryOrRegion: string
  postalCode: string
  postOfficeBox: string
  state: string
  street: string
  type: string
}

export type OutlookGeoCoordinates = {
  accuracy: number
  altitude: number
  altitudeAccuracy: number
  latitude: number
  longitude: number
}

export type Location = {
  address: PhysicalAddress
  coordinates: OutlookGeoCoordinates
  displayName: string
  locationType: string
  locationEmailAddress: string
  locationUri: string
  uniqueId: string
  uniqueIdType: string
}

export type EmailAddress = {
  name: string,
  address: string
}

export type ResponseStatus = {
  response: string,
  time: string
}

export type TimeSlot = {
  start: DateTimeTimeZone
  end: DateTimeTimeZone
}

export type Attendee = {
  type: string
  status: ResponseStatus
  emailAddress: EmailAddress
  proposedNewTime: TimeSlot
}

export type Recipient = {
  emailAddress: EmailAddress
}

export type Phone = {
  number: string
  type: string
}

export type OnlineMeeting = {
  conferenceId: string
  joinUrl: string
  phones: Phone[]
  quickDial: string
  tollFreeNumbers: string[]
  tollNumber: string
}

export type RecurrencePattern = {
  dayOfMonth: number
  daysOfWeek: string[]
  firstDayOfWeek: string
  index: string
  interval: number
  month: number
  type: string
}

export type RecurrenceRange = {
  endDate: string
  numberOfOccurrences: number
  recurrenceTimeZone: string
  startDate: string
  type: string
}

export type PatternedRecurrence = {
  pattern: RecurrencePattern
  range: RecurrenceRange
}

export type Extension = {
  id: string
}

export type FollowUpFlag = {
  flagStatus: string
  completedDateTime: DateTimeTimeZone
  dueDateTime: DateTimeTimeZone
  startDateTime: DateTimeTimeZone
}

export type Attachment = {
  contentType: string
  id: string
  isInline: boolean
  lastModifiedDateTime: string
  name: string
  size: number
}

export type InternetMessageHeader = {
  name: string
  value: string
}

export type MentionsPreview = {
  isMentioned: boolean
}

export type Mention = {
  application: string
  clientReference: string
  createdBy: EmailAddress
  createdDateTime: string
  deepLink: string
  id: string
  mentioned: EmailAddress
  mentionText: string
  serverCreatedDateTime: string
}

export type Calendar = {
  allowedOnlineMeetingProviders: string[]
  canEdit: boolean
  canShare: boolean
  canViewPrivateItems: boolean
  changeKey: string
  color: string
  defaultOnlineMeetingProvider: string
  hexColor: string
  id: string
  isDefaultCalendar: boolean
  isRemovable: boolean
  isShared: boolean
  isSharedWithMe: boolean
  isTallyingResponses: boolean
  name: string
  owner: EmailAddress
}

export type Event = {
  id: string
  subject: string
  bodyPreview: string
  body: ItemBody
  categories: string[]
  changeKey: string
  start: DateTimeTimeZone
  end: DateTimeTimeZone
  location: Location
  locations: Location[]
  attendees: Attendee[]
  organizer: Recipient
  allowNewTimeProposals: boolean
  createdDateTime: string
  hasAttachments: boolean
  uid: string
  importance: string
  isAllDay: boolean
  isCancelled: boolean
  isDraft: boolean
  isOnlineMeeting: boolean
  isOrganizer: boolean
  isReminderOn: boolean
  lastModifiedDateTime: string
  onlineMeeting: OnlineMeeting
  onlineMeetingProvider: string
  onlineMeetingUrl: string
  originalEndTimeZone: string
  originalStart: string
  originalStartTimeZone: string
  recurrence: PatternedRecurrence
  reminderMinutesBeforeStart: number
  responseRequested: boolean
  responseStatus: ResponseStatus
  sensitivity: string
  seriesMasterId: string
  showAs: string
  type: string
  webLink: string
  attachments: Attachment[]
  calendar: Calendar
  extensions: Extension[]
}

export type Message = {
  id: string
  createdDateTime: string
  lastModifiedDateTime: string
  changeKey: string
  categories: string[]
  receivedDateTime: string
  sentDateTime: string
  hasAttachments: boolean
  internetMessageId: string
  subject: string
  bodyPreview: string
  importance: string
  parentFolderId: string
  conversationId: string
  conversationIndex: string
  isDeliveryReceiptRequested: boolean
  isReadReceiptRequested: boolean
  isRead: boolean
  isDraft: boolean
  webLink: string
  inferenceClassification: string
  internetMessageHeaders: InternetMessageHeader[]
  unsubscribeData: string
  unsubscribeEnabled: boolean
  mentionsPreview: MentionsPreview
  body: ItemBody
  uniqueBody: ItemBody
  sender: Recipient
  from: Recipient
  attachments: Attachment[]
  extensions: Extension[]
  toRecipients: Recipient[]
  ccRecipients: Recipient[]
  bccRecipients: Recipient[]
  mentions: Mention[]
  replyTo: Recipient[]
  flag: FollowUpFlag
}
