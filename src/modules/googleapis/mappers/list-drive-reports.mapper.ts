import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../helpers/mapper.helper'
import { Report, itemSchemaWithoutEvents } from './list-application-reports-mapper.helper'

const schema: Schema<Report> = {
  kind: TYPES.String,
  etag: TYPES.ETag,
  items: [
    {
      ...itemSchemaWithoutEvents,
      events: [
        {
          type: TYPES.String,
          name: [
            'create',
            'view',
            'edit',
            'upload',
            'download',
            'delete',
            'copy',
            'approval_requested',
            'approval_canceled',
            'approval_reviewer_responded',
            'email_as_attachment'
          ],
          parameters: [
            {
              name: 'id',
              value: TYPES.String
            },
            {
              name: 'created_at',
              value: TYPES.String
            },
            {
              name: 'event_type',
              value: TYPES.String
            },
            {
              name: 'event_name',
              value: TYPES.String
            },
            {
              name: 'primary_event',
              boolValue: TYPES.Boolean
            },
            {
              name: 'doc_id',
              value: [TYPES.Hashed, TYPES.String]
            },
            {
              name: 'doc_type',
              value: TYPES.String
            },
            {
              name: 'doc_title',
              value: [TYPES.Private, TYPES.String]
            },
            {
              name: 'visibility',
              value: TYPES.String
            },
            {
              name: 'actor',
              value: TYPES.String
            },
            {
              name: 'actor_profile_id',
              value: TYPES.String
            },
            {
              name: 'actor_is_collaborator_account',
              boolValue: TYPES.Boolean
            },
            {
              name: 'owner',
              value: TYPES.Email
            },
            {
              name: 'owner_is_shared_drive',
              boolValue: TYPES.Boolean
            },
            {
              name: 'owner_is_team_drive',
              boolValue: TYPES.Boolean
            }
          ]
        }
      ]
    }
  ],
  nextPageToken: TYPES.String
}

export const listDriveReportsMapper = jsonMapper<typeof schema, Report>(schema)
