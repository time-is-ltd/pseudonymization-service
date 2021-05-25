import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../helpers/mapper.helper'

export interface MeetReportItemEventNestedParameter {
  name: string
  value: string
  multiValue: string
  intValue: string
  multiIntValue: string
  boolValue: boolean
  multiBoolValue: boolean[]
}

export interface MeetReportItemEventMessageValue {
  parameter: MeetReportItemEventNestedParameter[]
}

export interface MeetReportItemEventParameter {
  messageValue?: MeetReportItemEventMessageValue
  name: string
  value?: string
  multiValue?: string[]
  intValue?: string
  multiIntValue?: string[]
  boolValue?: boolean
  multiMessageValue?: MeetReportItemEventMessageValue[]
}

export interface MeetReportItemEvent {
  type: string
  name: string
  parameters: MeetReportItemEventParameter[]
}

export interface MeetReportItemId {
  time: string
  uniqueQualifier: string
  applicationName: string
  customerId: string
}

export interface MeetReportItemActor {
  profileId: string
  email: string
  callerType: string
  key: string
}

export interface MeetReportItem {
  kind: string
  etag: string
  ownerDomain: string
  ipAddress: string
  events: MeetReportItemEvent[]
  id: MeetReportItemId
  actor: MeetReportItemActor
}

export interface MeetReport {
  kind: string
  etag: string
  items: MeetReportItem[]
  nextPageToken: string
}

const messageValue: Schema<MeetReportItemEventMessageValue> = {
  parameter: [
    {
      name: TYPES.String,
      value: TYPES.String,
      multiValue: TYPES.String,
      intValue: TYPES.String,
      multiIntValue: TYPES.String,
      boolValue: TYPES.Boolean,
      multiBoolValue: [TYPES.Array, TYPES.Boolean]
    }
  ]
}

const schema: Schema<MeetReport> = {
  kind: TYPES.String,
  etag: TYPES.ETag,
  items: [
    {
      kind: TYPES.String,
      etag: TYPES.ETag,
      ownerDomain: [TYPES.Private, TYPES.String],
      ipAddress: [TYPES.Private, TYPES.String],
      events: [
        {
          type: TYPES.String,
          name: TYPES.String,
          parameters: [
            {
              name: 'audio_recv_seconds',
              intValue: TYPES.String
            },
            {
              name: 'audio_send_seconds',
              intValue: TYPES.String
            },
            {
              name: 'calendar_event_id',
              value: TYPES.String
            },
            {
              name: 'conference_id',
              value: TYPES.String
            },
            {
              name: 'device_type',
              value: TYPES.String
            },
            {
              name: 'display_name',
              value: [TYPES.Private, TYPES.String]
            },
            {
              name: 'duration_seconds',
              intValue: TYPES.String
            },
            {
              name: 'end_of_call_rating',
              intValue: TYPES.String
            },
            {
              name: 'endpoint_id',
              value: TYPES.String
            },
            {
              name: 'identifier_type',
              value: TYPES.String
            },
            {
              name: 'identifier',
              value: TYPES.Email
            },
            {
              name: 'is_external',
              boolValue: TYPES.Boolean
            },
            {
              name: 'location_country',
              value: TYPES.String
            },
            {
              name: 'location_region',
              value: TYPES.String
            },
            {
              name: 'meeting_code',
              value: TYPES.String
            },
            {
              name: 'organizer_email',
              value: TYPES.Email
            },
            {
              name: 'product_type',
              value: TYPES.String
            },
            {
              name: 'screencast_recv_seconds',
              intValue: TYPES.String
            },
            {
              name: 'screencast_send_seconds',
              intValue: TYPES.String
            },
            {
              name: 'video_recv_seconds',
              intValue: TYPES.String
            },
            {
              name: 'video_send_seconds',
              intValue: TYPES.String
            }
          ]
        }
      ],
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
  ],
  nextPageToken: TYPES.String
}

export default jsonMapper<typeof schema, MeetReport>(schema)
