import {
  jsonMapper,
  TYPES,
  type Schema
} from '../../../mapper'
import { itemSchemaWithoutEvents, type ActivityReport } from './list-activity-reports-mapper.helper'

const schema: Schema<ActivityReport> = {
  kind: TYPES.String,
  etag: TYPES.ETag,
  items: [
    {
      ...itemSchemaWithoutEvents,
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
      ]
    }
  ],
  nextPageToken: TYPES.String
}

export const listActivityReportsMeetMapper = jsonMapper<ActivityReport>(schema)
