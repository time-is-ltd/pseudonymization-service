import {
  jsonMapper,
  TYPES,
  type Schema
} from '../../../mapper'
import { type CallRecordSession } from '../common/interfaces'
import { callRecordsSessionSchema } from '../common/schema'

export interface CallRecordSessions {
  '@odata.context': string
  '@odata.nextLink': string
  value: CallRecordSession[]
}

export const schema: Schema<CallRecordSessions> = {
  '@odata.context': [
    TYPES.Private,
    TYPES.String
  ],
  '@odata.nextLink': [
    TYPES.String,
    TYPES.Proxify
  ],
  value: [
    callRecordsSessionSchema
  ]
}

export const listCommunicationsCallRecordsSessionsMapper = jsonMapper<CallRecordSessions>(schema)
