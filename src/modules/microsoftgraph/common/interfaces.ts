
export interface ItemBody {
  contentType: string
  content: string
}

export interface DateTimeTimeZone {
  dateTime: string
  timeZone: string
}

export interface PhysicalAddress {
  city: string
  countryOrRegion: string
  postalCode: string
  postOfficeBox: string
  state: string
  street: string
  type: string
}

export interface OutlookGeoCoordinates {
  accuracy: number
  altitude: number
  altitudeAccuracy: number
  latitude: number
  longitude: number
}

export interface Location {
  address: PhysicalAddress
  coordinates: OutlookGeoCoordinates
  displayName: string
  locationType: string
  locationEmailAddress: string
  locationUri: string
  uniqueId: string
  uniqueIdType: string
}

export interface EmailAddress {
  name: string
  address: string
}

export interface ResponseStatus {
  response: string
  time: string
}

export interface TimeSlot {
  start: DateTimeTimeZone
  end: DateTimeTimeZone
}

export interface Attendee {
  type: string
  status: ResponseStatus
  emailAddress: EmailAddress
  proposedNewTime: TimeSlot
}

export interface Recipient {
  emailAddress: EmailAddress
}

export interface Phone {
  number: string
  type: string
}

export interface OnlineMeeting {
  conferenceId: string
  joinUrl: string
  phones: Phone[]
  quickDial: string
  tollFreeNumbers: string[]
  tollNumber: string
}

export interface RecurrencePattern {
  dayOfMonth: number
  daysOfWeek: string[]
  firstDayOfWeek: string
  index: string
  interval: number
  month: number
  type: string
}

export interface RecurrenceRange {
  endDate: string
  numberOfOccurrences: number
  recurrenceTimeZone: string
  startDate: string
  type: string
}

export interface PatternedRecurrence {
  pattern: RecurrencePattern
  range: RecurrenceRange
}

export interface Extension {
  id: string
}

export interface FollowUpFlag {
  flagStatus: string
  completedDateTime: DateTimeTimeZone
  dueDateTime: DateTimeTimeZone
  startDateTime: DateTimeTimeZone
}

export interface Attachment {
  contentType: string
  id: string
  isInline: boolean
  lastModifiedDateTime: string
  name: string
  size: number
}

export interface InternetMessageHeader {
  name: string
  value: string
}

export interface MentionsPreview {
  isMentioned: boolean
}

export interface Mention {
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

export interface Calendar {
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

export interface Event {
  id: string
  iCalUId: string
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
  calendar?: Calendar
  extensions: Extension[]
}

export interface Message {
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

export interface Identity {
  displayName: string
  id: string
  tenantId: string
}

export interface IdentitySet {
  application: Identity
  device: Identity
  user: Identity
}

export interface CallRecordsEndpoint {
  identity: IdentitySet
}

export interface CallRecordsFailureInfo {
  reason: string
  stage: string
}

export interface CallRecordSession {
  id: string
  caller: CallRecordsEndpoint
  callee: CallRecordsEndpoint
  failureInfo: CallRecordsFailureInfo
  modalities: string[]
  startDateTime: string
  endDateTime: string
}
