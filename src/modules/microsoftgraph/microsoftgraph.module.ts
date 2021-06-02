import { proxyFactory } from '../../proxy'
import { oauth2Request, TokenHandlerOptions } from '../../oauth2/handlers/oauth2-token.handler'
import { Route } from '../../router/interfaces/router.interface'
import {
  listUserMessagesMapper,
  listUserCalendarsMapper,
  listUserEventsMapper,
  createSubscriptionMapper,
  listCommunicationsCallRecordsMapper,
  getUserIdMapper,
  listMailFoldersMapper,
  getMailFolderMapper
} from './mappers'

import tokenService from '../../token/token.service'

import config, {
  hosts,
  paths
} from './microsoftgraph.config'
import { listCommunicationsCallRecordsSessionsMapper } from './mappers/list-comunications-call-records-sessions.mapper'

type TokenType = 'application' | 'delegated'
const MICROSOFTGRAPH_DELEGATED_TOKEN_ID = 'microsoftgraph.delegated'
const MICROSOFTGRAPH_APPLICATION_TOKEN_ID = 'microsoftgraph.application'
const TOKEN_HOST = 'login.microsoftonline.com'

interface RefreshTokenConfig {
  tokenId: string
  tenantId: string
  clientId: string
  clientSecret?: string
  refreshToken?: string
}

const requestToken = async (config: RefreshTokenConfig) => {
  const { tokenId, tenantId, clientId, clientSecret, refreshToken } = config
  const TOKEN_URL = `https://${TOKEN_HOST}/${tenantId}/oauth2/v2.0/token`

  const oauth2Options: TokenHandlerOptions = {
    url: TOKEN_URL,
    clientId,
    extra: {
      scope: 'https://graph.microsoft.com/.default'
    }
  }

  if (refreshToken) {
    oauth2Options.grantType = 'refresh_token'
    oauth2Options.refreshToken = refreshToken
  } else {
    oauth2Options.clientSecret = clientSecret
  }

  const response = await oauth2Request(oauth2Options)
  const token = tokenService.update({
    id: tokenId,
    ...response.data
  })

  return token
}

const getAuthorizationFactory = (forceTokenType?: TokenType) => async () => {
  const [tenantId, clientId, clientSecret, refreshToken] = await Promise.all([config.tenantId, config.clientId, config.clientSecret, config.refreshToken])
  const hasApplicationTokenCredentials = tenantId && clientId && clientSecret
  const hasDelegatedTokenCredentials = tenantId && clientId && refreshToken

  const getTokenType = (): TokenType => {
    if (forceTokenType) return forceTokenType
    if (hasDelegatedTokenCredentials) return 'delegated'
    if (hasApplicationTokenCredentials) return 'application'
  }

  const tokenType = getTokenType()
  const tokenId = tokenType === 'delegated'
    ? MICROSOFTGRAPH_DELEGATED_TOKEN_ID
    : MICROSOFTGRAPH_APPLICATION_TOKEN_ID

  let token = tokenService.getById(tokenId)

  const isValid = !!token && tokenService.isValid(token)

  if (!isValid) {
    token = await requestToken({
      tokenId,
      tenantId,
      clientId,
      clientSecret,
      refreshToken
    })
  }

  return `Bearer ${token.token}`
}

const listUserMessagesRoute: Route = {
  hosts,
  path: paths.listUserMessagesPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory(),
    dataMapper: listUserMessagesMapper
  })
}

const listUserCalendarsRoute: Route = {
  hosts,
  path: paths.listUserCalendarsPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory(),
    dataMapper: listUserCalendarsMapper
  })
}

const listUserEventsRoute: Route = {
  hosts,
  path: paths.listUserEventsPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory(),
    dataMapper: listUserEventsMapper
  })
}

const listCalendarEventsRoute: Route = {
  hosts,
  path: paths.listCalendarEventsPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory(),
    dataMapper: listUserEventsMapper
  })
}

const listCalendarViewRoute: Route = {
  hosts,
  path: paths.listCalendarViewPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory(),
    dataMapper: listUserEventsMapper
  })
}

const createSubscriptionRoute: Route = {
  hosts,
  method: 'post',
  path: paths.subscriptionsPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory('application'),
    dataMapper: createSubscriptionMapper
  })
}

const updateSubscriptionRoute: Route = {
  hosts,
  method: 'patch',
  path: paths.subscriptionsIdPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory('application'),
    dataMapper: createSubscriptionMapper
  })
}

const listComunicationsCallRecordsRoute: Route = {
  hosts,
  path: paths.listComunicationsCallRecordsPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory('application'),
    dataMapper: listCommunicationsCallRecordsMapper
  })
}

const listComunicationsCallRecordsSessionsRoute: Route = {
  hosts,
  path: paths.listComunicationsCallRecordsSessionsPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory('application'),
    dataMapper: listCommunicationsCallRecordsSessionsMapper
  })
}

const getUserIdRoute: Route = {
  hosts,
  path: paths.getUserIdPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory(),
    dataMapper: getUserIdMapper
  })
}

const listMailFoldersRoute: Route = {
  hosts,
  path: paths.listMailFoldersPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory(),
    dataMapper: listMailFoldersMapper
  })
}

const getMailFolderRoute: Route = {
  hosts,
  path: paths.getMailFolderPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory(),
    dataMapper: getMailFolderMapper
  })
}

const listMailFolderMessagesRoute: Route = {
  hosts,
  path: paths.listMailFolderMessagesPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory(),
    dataMapper: listUserMessagesMapper
  })
}

export default async () => {
  const applicationCredentials = await Promise.all([
    config.tenantId,
    config.clientId,
    config.clientSecret
  ])

  const delegatedCredentials = await Promise.all([
    config.tenantId,
    config.clientId,
    config.refreshToken
  ])

  const hasAll = (secrets: string[]) => secrets
    .reduce((result, item) => {
      return result && Boolean(item)
    }, true)


  const enabled = hasAll(applicationCredentials) || hasAll(delegatedCredentials)
  return {
    enabled,
    routes: [
      listUserMessagesRoute,
      listUserCalendarsRoute,
      listUserEventsRoute,
      listCalendarEventsRoute,
      listCalendarViewRoute,
      createSubscriptionRoute,
      updateSubscriptionRoute,
      listComunicationsCallRecordsRoute,
      listComunicationsCallRecordsSessionsRoute,
      getUserIdRoute,
      listMailFoldersRoute,
      getMailFolderRoute,
      listMailFolderMessagesRoute
    ]
  }
}
