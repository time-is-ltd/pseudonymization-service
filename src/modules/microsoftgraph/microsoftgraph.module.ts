import proxyJsonRequestHandler from '../../proxy/handlers/proxy-json-request.handler'
import oauth2TokenHandler, { oauth2Request } from '../../oauth2/handlers/oauth2-token.handler'
import { Route } from '../../router/interfaces/router.interface'
import listUserMessagesMapper from './mappers/list-user-messages.mapper'
import listUserCalendarsMapper from './mappers/list-user-calendars.mapper'
import listUserEventsMapper from './mappers/list-user-events.mapper'
import { anonymizeCalendarSummary, anonymizeCalendarDescription } from '../../config'

import tokenService from '../../token/token.service'

import {
  tenantId,
  clientId,
  clientSecret,
  hosts,
  paths
} from './microsoftgraph.config'

const MICROSOFTGRAPH_TOKEN_ID = 'microsoftgraph'
const TOKEN_HOST = 'login.microsoftonline.com'
const TOKEN_PATH = `/${tenantId}/oauth2/token`
const TOKEN_URL = `https://${TOKEN_HOST}${TOKEN_PATH}`
const oauth2Options = {
  url: TOKEN_URL,
  clientId,
  clientSecret,
  extra: {
    resource: 'https://graph.microsoft.com'
  }
}

const refreshToken = async () => {
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
  handler: proxyJsonRequestHandler(authorizationFactory, listUserMessagesMapper)
}

const listUserCalendarsRoute: Route = {
  hosts,
  path: paths.listUserCalendarsPath,
  handler: proxyJsonRequestHandler(authorizationFactory, listUserCalendarsMapper(anonymizeCalendarSummary))
}

const listUserEventsRoute: Route = {
  hosts,
  path: paths.listUserEventsPath,
  handler: proxyJsonRequestHandler(authorizationFactory, listUserEventsMapper(anonymizeCalendarSummary, anonymizeCalendarDescription))
}

const listCalendarEventsRoute: Route = {
  hosts,
  path: paths.listCalendarEventsPath,
  handler: proxyJsonRequestHandler(authorizationFactory, listUserEventsMapper(anonymizeCalendarSummary, anonymizeCalendarDescription))
}

const oauth2TokenRoute: Route = {
  hosts: [TOKEN_HOST],
  path: TOKEN_PATH,
  method: 'post',
  requireAuth: false,
  handler: oauth2TokenHandler(oauth2Options, (token) => {
    tokenService.update({
      id: MICROSOFTGRAPH_TOKEN_ID,
      ...token
    })
  })
}

export const enabled = !!(tenantId && clientId && clientSecret)

export default () => {
  return {
    enabled,
    routes: [
      listUserMessagesRoute,
      listUserCalendarsRoute,
      listUserEventsRoute,
      listCalendarEventsRoute,
      oauth2TokenRoute
    ]
  }
}
