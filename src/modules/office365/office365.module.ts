import { proxyFactory } from '../../proxy'
import { oauth2Request, TokenHandlerOptions } from '../../oauth2/handlers/oauth2-token.handler'
import { Route } from '../../router/interfaces/router.interface'
import {
  startSubscriptionMapper,
  stopSubscriptionMapper,
  listSubscriptionMapper,
  listContentMapper,
  auditMapper
} from './mappers'

import tokenService from '../../token/token.service'

import config, {
  hosts,
  paths
} from './office365.config'

type TokenType = 'application' | 'delegated'
const MICROSOFTGRAPH_DELEGATED_TOKEN_ID = 'o365.delegated'
const MICROSOFTGRAPH_APPLICATION_TOKEN_ID = 'o365.application'
const TOKEN_HOST = 'login.windows.net'

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
      scope: 'https://manage.office.com/.default'
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

const startSubscriptionRoute: Route = {
  hosts,
  method: 'post',
  path: paths.subscriptionsStartPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory('application'),
    dataMapper: startSubscriptionMapper
  })
}

const stopSubscriptionRoute: Route = {
  hosts,
  method: 'post',
  path: paths.subscriptionsStopPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory('application'),
    dataMapper: stopSubscriptionMapper
  })
}

const listSubscriptionsRoute: Route = {
  hosts,
  method: 'get',
  path: paths.subscriptionsListPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory('application'),
    dataMapper: listSubscriptionMapper
  })
}

const listContentRoute: Route = {
  hosts,
  method: 'get',
  path: paths.subscriptionsContentPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory('application'),
    dataMapper: listContentMapper
  })
}

const auditRoute: Route = {
  hosts,
  method: 'get',
  path: paths.auditPath,
  handler: proxyFactory({
    authorizationFactory: getAuthorizationFactory('application'),
    dataMapper: auditMapper
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
      startSubscriptionRoute,
      stopSubscriptionRoute,
      listSubscriptionsRoute,
      listContentRoute,
      auditRoute
    ]
  }
}
