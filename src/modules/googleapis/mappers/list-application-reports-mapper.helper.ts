import { TYPES, Schema } from '../../../helpers/mapper.helper'

export interface ReportItemEventNestedParameter {
  name: string
  value: string
  multiValue: string
  intValue: string
  multiIntValue: string
  boolValue: boolean
  multiBoolValue: boolean[]
}

export interface ReportItemEventMessageValue {
  parameter: ReportItemEventNestedParameter[]
}

export interface ReportItemEventParameter {
  messageValue?: ReportItemEventMessageValue
  name: string
  value?: string
  multiValue?: string[]
  intValue?: string
  multiIntValue?: string[]
  boolValue?: boolean
  multiMessageValue?: ReportItemEventMessageValue[]
}

export interface ReportItemEvent {
  type: string
  name: string
  parameters: ReportItemEventParameter[]
}

export interface ReportItemId {
  time: string
  uniqueQualifier: string
  applicationName: string
  customerId: string
}

export interface ReportItemActor {
  profileId: string
  email: string
  callerType: string
  key: string
}

export interface ReportItem {
  kind: string
  etag: string
  ownerDomain: string
  ipAddress: string
  events: ReportItemEvent[]
  id: ReportItemId
  actor: ReportItemActor
}

export interface Report {
  kind: string
  etag: string
  items: ReportItem[]
  nextPageToken: string
}

export const idSchema: Schema<ReportItemId> = {
  time: TYPES.String,
  uniqueQualifier: TYPES.String,
  applicationName: TYPES.String,
  customerId: TYPES.String
}

export const actorSchema: Schema<ReportItemActor> = {
  profileId: TYPES.String,
  email: TYPES.Email,
  callerType: TYPES.String,
  key: TYPES.String
}

export const itemSchemaWithoutEvents: Schema<Omit<ReportItem, 'events'>> = {
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


