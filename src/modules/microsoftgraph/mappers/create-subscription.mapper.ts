import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../mapper'

export interface CreateSubscription {
  '@odata.context': string
  id: string
  resource: string
  applicationId: string
  changeType: string
  clientState: string
  notificationUrl: string
  lifecycleNotificationUrl: string
  expirationDateTime: string
  creatorId: string
  latestSupportedTlsVersion: string
  notificationContentType: string
  includeResourceData: boolean
  notificationQueryOptions: string
  encryptionCertificate: string
}

const schema: Schema<CreateSubscription> = {
  '@odata.context': [
    TYPES.Private,
    TYPES.String
  ],
  id: TYPES.String,
  resource: TYPES.String,
  applicationId: TYPES.String,
  changeType: TYPES.String,
  clientState: TYPES.String,
  notificationUrl: TYPES.String,
  lifecycleNotificationUrl: TYPES.String,
  expirationDateTime: TYPES.String,
  creatorId: TYPES.String,
  latestSupportedTlsVersion: TYPES.String,
  notificationContentType: TYPES.ContentType,
  includeResourceData: TYPES.String,
  notificationQueryOptions: TYPES.String,
  encryptionCertificate: [
    TYPES.Private,
    TYPES.String
  ]
}

export const createSubscriptionMapper = jsonMapper<typeof schema, CreateSubscription>(schema)
