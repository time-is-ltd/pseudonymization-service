import { TYPES, Schema } from '../../../mapper'

export interface ActivityReportItemEventNestedParameter {
  name: string
  value: string
  multiValue: string
  intValue: string
  multiIntValue: string
  boolValue: boolean
  multiBoolValue: boolean[]
}

export interface ActivityReportItemEventMessageValue {
  parameter: ActivityReportItemEventNestedParameter[]
}

export interface ActivityReportItemEventParameter {
  messageValue?: ActivityReportItemEventMessageValue
  name: string
  value?: string
  multiValue?: string[]
  intValue?: string
  multiIntValue?: string[]
  boolValue?: boolean
  multiMessageValue?: ActivityReportItemEventMessageValue[]
}

export interface ActivityReportItemEvent {
  type: string
  name: string
  parameters: ActivityReportItemEventParameter[]
}

export interface ActivityReportItemId {
  time: string
  uniqueQualifier: string
  applicationName: string
  customerId: string
}

export interface ActivityReportItemActor {
  profileId: string
  email: string
  callerType: string
  key: string
}

export interface ActivityReportItem {
  kind: string
  etag: string
  ownerDomain: string
  ipAddress: string
  events: ActivityReportItemEvent[]
  id: ActivityReportItemId
  actor: ActivityReportItemActor
}

export interface ActivityReport {
  kind: string
  etag: string
  items: ActivityReportItem[]
  nextPageToken: string
}

export const idSchema: Schema<ActivityReportItemId> = {
  time: TYPES.String,
  uniqueQualifier: TYPES.String,
  applicationName: TYPES.String,
  customerId: TYPES.String
}

export const actorSchema: Schema<ActivityReportItemActor> = {
  profileId: TYPES.String,
  email: TYPES.Email,
  callerType: TYPES.String,
  key: TYPES.String
}

export const itemSchemaWithoutEvents: Schema<Omit<ActivityReportItem, 'events'>> = {
  kind: TYPES.String,
  etag: TYPES.ETag,
  ownerDomain: [TYPES.Private, TYPES.String],
  ipAddress: [TYPES.Private, TYPES.String],
  id: {
    time: TYPES.String,
    uniqueQualifier: TYPES.String,
    applicationName: TYPES.String,
    customerId: TYPES.String
  },
  actor: {
    profileId: TYPES.String,
    email: TYPES.Email,
    callerType: TYPES.String,
    key: TYPES.String
  }
}
