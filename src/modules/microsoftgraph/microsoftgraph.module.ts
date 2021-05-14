import { proxyFactory } from '../../proxy'
import { oauth2Request, TokenHandlerOptions } from '../../oauth2/handlers/oauth2-token.handler'
import { Route } from '../../router/interfaces/router.interface'
import listUserMessagesMapper from './mappers/list-user-messages.mapper'
import listUserCalendarsMapper from './mappers/list-user-calendars.mapper'
import listUserEventsMapper from './mappers/list-user-events.mapper'

import tokenService from '../../token/token.service'

import config, {
  hosts,
  paths
} from './microsoftgraph.config'

const MICROSOFTGRAPH_TOKEN_ID = 'microsoftgraph'
const TOKEN_HOST = 'login.microsoftonline.com'

const refreshToken = async () => {
  const [tenantId, clientId, clientSecret, refreshToken] = await Promise.all([config.tenantId, config.clientId, config.clientSecret, config.refreshToken])
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
    id: MICROSOFTGRAPH_TOKEN_ID,
    ...response.data
  })

  return token
}

const authorizationFactory = async () => {
  let token = tokenService.getById(MICROSOFTGRAPH_TOKEN_ID)

  const isValid = !!token && tokenService.isValid(token)

  if (!isValid) {
    token = await refreshToken()
  }

  return `Bearer ${token.token}`
}

const listUserMessagesRoute: Route = {
  hosts,
  path: paths.listUserMessagesPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUserMessagesMapper
  })
}

const listUserCalendarsRoute: Route = {
  hosts,
  path: paths.listUserCalendarsPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUserCalendarsMapper
  })
}

const listUserEventsRoute: Route = {
  hosts,
  path: paths.listUserEventsPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUserEventsMapper
  })
}

const listCalendarEventsRoute: Route = {
  hosts,
  path: paths.listCalendarEventsPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUserEventsMapper
  })
}

const listCalendarViewRoute: Route = {
  hosts,
  path: paths.listCalendarViewPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUserEventsMapper
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
      listCalendarViewRoute
    ]
  }
}
