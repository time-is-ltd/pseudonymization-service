import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../helpers/mapper.helper'

interface UsageReportEntity {
  customerId: string
  userEmail: string
  profileId: string
  entityId: string
  type: string
}

interface UsageReportParameter {
  intValue: string
  name: string
  stringValue: string
  datetimeValue: string
  boolValue: boolean
  msgValue: unknown
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
        {
          intValue: TYPES.String,
          name: TYPES.String,
          stringValue: TYPES.String,
          datetimeValue: TYPES.String,
          boolValue: TYPES.Boolean,
          msgValue: TYPES.Passthrough
        }
      ],
      etag: TYPES.ETag,
      entity: {
        customerId: TYPES.String,
        userEmail:  TYPES.Email,
        profileId: TYPES.String,
        entityId: TYPES.String,
        type: TYPES.String
      }
    }
  ],
  nextPageToken: TYPES.String
}

export const listUsageReportsMapper = jsonMapper<typeof schema, UsageReport>(schema)
