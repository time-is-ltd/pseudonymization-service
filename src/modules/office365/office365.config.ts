import {configFactory, toString} from '../../config'

const o365ApisConfig = {
  o365TenantId: toString(),
  o365ClientId: toString(),
  o365ClientSecret: toString(),
  o365RefreshToken: toString()
}

const config = configFactory(o365ApisConfig, [
  'o365TenantId',
  'o365ClientId',
  'o365ClientSecret',
  'o365RefreshToken'
])

// Hosts
export const hosts = [
  'manage.office.com'
]

// Router paths
const subscriptionsStartPath = '/api/v1.0/:tenantId/activity/feed/subscriptions/start'
const subscriptionsStopPath = '/api/v1.0/:tenantId/activity/feed/subscriptions/stop'
const subscriptionsListPath = '/api/v1.0/:tenantId/activity/feed/subscriptions/list'
const subscriptionsContentPath = '/api/v1.0/:tenantId/activity/feed/subscriptions/content'
const auditPath = '/api/v1.0/:tenantId/activity/feed/audit/:contentId'

export const paths = {
  subscriptionsStartPath: subscriptionsStartPath,
  subscriptionsStopPath: subscriptionsStopPath,
  subscriptionsListPath: subscriptionsListPath,
  subscriptionsContentPath: subscriptionsContentPath,
  auditPath: auditPath
}

export const tenantId = config.o365TenantId
export const clientId = config.o365ClientId
export const clientSecret = config.o365ClientSecret
export const refreshToken = config.o365RefreshToken

export default {
  tenantId,
  clientId,
  clientSecret,
  refreshToken,
  hosts,
  paths
}
