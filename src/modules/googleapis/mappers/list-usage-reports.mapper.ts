import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../mapper'

interface UsageReportEntity {
  customerId: string
  userEmail: string
  profileId: string
  entityId: string
  type: string
}

interface UsageReportParameter {
  intValue?: string
  name: string
  stringValue?: string
  datetimeValue?: string
  boolValue?: boolean
  msgValue?: unknown
}

interface UsageReportItem {
  kind: string
  date: string
  parameters: UsageReportParameter[]
  etag: string
  entity: UsageReportEntity
}

interface UsageReportWarningData {
  key: string
  value: string
}

interface UsageReportWarning {
  code: string
  message: string
  data: UsageReportWarningData[]
}

interface UsageReport {
  kind: string
  etag: string
  warnings: UsageReportWarning[]
  usageReports: UsageReportItem[]
  nextPageToken: string
}

const driveParameterNames = [
  'num_1day_active_users',
  'num_1day_google_documents_active_users',
  'num_1day_google_drawings_active_users',
  'num_1day_google_forms_active_users',
  'num_1day_google_presentations_active_users',
  'num_1day_google_sites_active_users',
  'num_1day_google_spreadsheets_active_users',
  'num_1day_other_types_active_users',
  'num_30day_active_users',
  'num_30day_google_documents_active_users',
  'num_30day_google_drawings_active_users',
  'num_30day_google_forms_active_users',
  'num_30day_google_presentations_active_users',
  'num_30day_google_sites_active_users',
  'num_30day_google_spreadsheets_active_users',
  'num_30day_other_types_active_users',
  'num_7day_active_users',
  'num_7day_google_documents_active_users',
  'num_7day_google_drawings_active_users',
  'num_7day_google_forms_active_users',
  'num_7day_google_presentations_active_users',
  'num_7day_google_sites_active_users',
  'num_7day_google_spreadsheets_active_users',
  'num_7day_other_types_active_users',
  'num_collaborators',
  'num_consumers',
  'num_creators',
  'num_google_documents_created',
  'num_google_documents_edited',
  'num_google_documents_trashed',
  'num_google_documents_viewed',
  'num_google_drawings_created',
  'num_google_drawings_edited',
  'num_google_drawings_trashed',
  'num_google_drawings_viewed',
  'num_google_forms_created',
  'num_google_forms_edited',
  'num_google_forms_trashed',
  'num_google_forms_viewed',
  'num_google_presentations_created',
  'num_google_presentations_edited',
  'num_google_presentations_trashed',
  'num_google_presentations_viewed',
  'num_google_sites_created',
  'num_google_sites_edited',
  'num_google_sites_trashed',
  'num_google_sites_viewed',
  'num_google_spreadsheets_created',
  'num_google_spreadsheets_edited',
  'num_google_spreadsheets_trashed',
  'num_google_spreadsheets_viewed',
  'num_items_created',
  'num_items_edited',
  'num_items_trashed',
  'num_items_viewed',
  'num_monthly_active_users',
  'num_other_types_created',
  'num_other_types_edited',
  'num_other_types_trashed',
  'num_other_types_viewed',
  'num_owned_external_items_added',
  'num_owned_google_documents_added',
  'num_owned_google_documents_created',
  'num_owned_google_documents_delta',
  'num_owned_google_documents_edited',
  'num_owned_google_documents_removed',
  'num_owned_google_documents_trashed',
  'num_owned_google_documents_viewed',
  'num_owned_google_drawings_added',
  'num_owned_google_drawings_created',
  'num_owned_google_drawings_delta',
  'num_owned_google_drawings_edited',
  'num_owned_google_drawings_removed',
  'num_owned_google_drawings_trashed',
  'num_owned_google_drawings_viewed',
  'num_owned_google_forms_added',
  'num_owned_google_forms_created',
  'num_owned_google_forms_delta',
  'num_owned_google_forms_edited',
  'num_owned_google_forms_removed',
  'num_owned_google_forms_trashed',
  'num_owned_google_forms_viewed',
  'num_owned_google_presentations_added',
  'num_owned_google_presentations_created',
  'num_owned_google_presentations_delta',
  'num_owned_google_presentations_edited',
  'num_owned_google_presentations_removed',
  'num_owned_google_presentations_trashed',
  'num_owned_google_presentations_viewed',
  'num_owned_google_sites_added',
  'num_owned_google_sites_created',
  'num_owned_google_sites_delta',
  'num_owned_google_sites_edited',
  'num_owned_google_sites_removed',
  'num_owned_google_sites_trashed',
  'num_owned_google_sites_viewed',
  'num_owned_google_spreadsheets_added',
  'num_owned_google_spreadsheets_created',
  'num_owned_google_spreadsheets_delta',
  'num_owned_google_spreadsheets_edited',
  'num_owned_google_spreadsheets_removed',
  'num_owned_google_spreadsheets_trashed',
  'num_owned_google_spreadsheets_viewed',
  'num_owned_internal_items_added',
  'num_owned_items_added',
  'num_owned_items_created',
  'num_owned_items_delta',
  'num_owned_items_edited',
  'num_owned_items_removed',
  'num_owned_items_trashed',
  'num_owned_items_viewed',
  'num_owned_items_with_visibility_anyone_in_domain_added',
  'num_owned_items_with_visibility_anyone_in_domain_delta',
  'num_owned_items_with_visibility_anyone_in_domain_removed',
  'num_owned_items_with_visibility_anyone_in_domain_with_link_added',
  'num_owned_items_with_visibility_anyone_in_domain_with_link_delta',
  'num_owned_items_with_visibility_anyone_in_domain_with_link_removed',
  'num_owned_items_with_visibility_anyone_with_link_added',
  'num_owned_items_with_visibility_anyone_with_link_delta',
  'num_owned_items_with_visibility_anyone_with_link_removed',
  'num_owned_items_with_visibility_private_added',
  'num_owned_items_with_visibility_private_delta',
  'num_owned_items_with_visibility_private_removed',
  'num_owned_items_with_visibility_public_added',
  'num_owned_items_with_visibility_public_delta',
  'num_owned_items_with_visibility_public_removed',
  'num_owned_items_with_visibility_shared_externally_added',
  'num_owned_items_with_visibility_shared_externally_delta',
  'num_owned_items_with_visibility_shared_externally_removed',
  'num_owned_items_with_visibility_shared_internally_added',
  'num_owned_items_with_visibility_shared_internally_delta',
  'num_owned_items_with_visibility_shared_internally_removed',
  'num_owned_other_types_added',
  'num_owned_other_types_created',
  'num_owned_other_types_delta',
  'num_owned_other_types_edited',
  'num_owned_other_types_removed',
  'num_owned_other_types_trashed',
  'num_owned_other_types_viewed',
  'num_sharers'
]

const meetParameterNames = [
  'average_meeting_minutes',
  'average_meeting_minutes_with_11_to_15_calls',
  'average_meeting_minutes_with_16_to_25_calls',
  'average_meeting_minutes_with_26_to_50_calls',
  'average_meeting_minutes_with_2_calls',
  'average_meeting_minutes_with_3_to_5_calls',
  'average_meeting_minutes_with_6_to_10_calls',
  'lonely_meetings',
  'max_concurrent_usage_chromebase',
  'max_concurrent_usage_chromebox',
  'num_1day_active_users',
  'num_30day_active_users',
  'num_7day_active_users',
  'num_calls',
  'num_calls_android',
  'num_calls_by_external_users',
  'num_calls_by_internal_users',
  'num_calls_by_pstn_in_users',
  'num_calls_by_pstn_out_users',
  'num_calls_chromebase',
  'num_calls_chromebox',
  'num_calls_ios',
  'num_calls_jamboard',
  'num_calls_unknown_client',
  'num_calls_web',
  'num_meetings',
  'num_meetings_android',
  'num_meetings_chromebase',
  'num_meetings_chromebox',
  'num_meetings_ios',
  'num_meetings_jamboard',
  'num_meetings_unknown_client',
  'num_meetings_web',
  'num_meetings_with_11_to_15_calls',
  'num_meetings_with_16_to_25_calls',
  'num_meetings_with_26_to_50_calls',
  'num_meetings_with_2_calls',
  'num_meetings_with_3_to_5_calls',
  'num_meetings_with_6_to_10_calls',
  'num_meetings_with_external_users',
  'num_meetings_with_pstn_in_users',
  'num_meetings_with_pstn_out_users',
  'total_call_minutes',
  'total_call_minutes_android',
  'total_call_minutes_by_external_users',
  'total_call_minutes_by_internal_users',
  'total_call_minutes_by_pstn_in_users',
  'total_call_minutes_by_pstn_out_users',
  'total_call_minutes_chromebase',
  'total_call_minutes_chromebox',
  'total_call_minutes_ios',
  'total_call_minutes_jamboard',
  'total_call_minutes_unknown_client',
  'total_call_minutes_web',
  'total_meeting_minutes'
]

const drivePrefixedParameterNames = driveParameterNames.map(name => ({
  intValue: TYPES.String,
  name: `drive:${name}`
}))

const meetPrefixedParameterNames = meetParameterNames.map(name => ({
  intValue: TYPES.String,
  name: `meet:${name}`
}))

const schema: Schema<UsageReport> = {
  kind: TYPES.String,
  etag: TYPES.ETag,
  warnings: [
    {
      code: TYPES.String,
      message: TYPES.String,
      data: [
        {
          key: TYPES.String,
          value: TYPES.String
        }
      ]
    }
  ],
  usageReports: [
    {
      kind: TYPES.String,
      date: TYPES.String,
      parameters: [
        ...drivePrefixedParameterNames,
        ...meetPrefixedParameterNames
      ],
      etag: TYPES.ETag,
      entity: {
        customerId: TYPES.String,
        userEmail: TYPES.Email,
        profileId: TYPES.String,
        entityId: TYPES.String,
        type: TYPES.String
      }
    }
  ],
  nextPageToken: TYPES.String
}

export const listUsageReportsMapper = jsonMapper<typeof schema, UsageReport>(schema)
