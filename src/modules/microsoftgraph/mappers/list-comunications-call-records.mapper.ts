import {
  jsonMapper,
  TYPES,
  type Schema
} from '../../../mapper'
import {
  type IdentitySet,
  type CallRecordSession
} from '../common/interfaces'
import {
  identitySetSchema,
  callRecordsSessionSchema
} from '../common/schema'

export interface CallRecord {
  '@odata.context': string
  '@odata.nextLink': string
  id: string
  version: number
  type: string
  modalities: string[]
  lastModifiedDateTime: string
  startDateTime: string
  endDateTime: string
  joinWebUrl: string
  organizer: IdentitySet
  participants: IdentitySet[]
  'sessions@odata.context': string
  'sessions@odata.nextLink': boolean
  sessions: CallRecordSession[]
}

export const schema: Schema<CallRecord> = {
  '@odata.context': [
    TYPES.Private,
    TYPES.String
  ],
  '@odata.nextLink': [
    TYPES.String,
    TYPES.Proxify
  ],
  id: TYPES.String,
  version: TYPES.Number,
  type: TYPES.String,
  modalities: [TYPES.Array, TYPES.String],
  lastModifiedDateTime: TYPES.String,
  startDateTime: TYPES.String,
  endDateTime: TYPES.String,
  joinWebUrl: TYPES.String,
  organizer: identitySetSchema,
  participants: [
    identitySetSchema
  ],
  'sessions@odata.context': TYPES.String,
  'sessions@odata.nextLink': TYPES.Boolean,
  sessions: [
    callRecordsSessionSchema
  ]
}

export const listCommunicationsCallRecordsMapper = jsonMapper<CallRecord>(schema)
