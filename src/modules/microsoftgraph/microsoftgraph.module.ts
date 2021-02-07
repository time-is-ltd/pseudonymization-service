import proxyJsonRequestHandler from '../../proxy/handlers/proxy-json-request.handler'
import oauth2TokenHandler, { oauth2Request } from '../../oauth2/handlers/oauth2-token.handler'
import { Route } from '../../router/interfaces/router.interface'
import listUserMessagesMapper from './mappers/list-user-messages.mapper'
import listUserCalendarsMapper from './mappers/list-user-calendars.mapper'
import listUserEventsMapper from './mappers/list-user-events.mapper'

import tokenService from '../../token/token.service'
import { getSecret } from '../../keyvault/keyvault.service'

import {
  microsoftApiEnabled,
  hosts,
  paths
} from './microsoftgraph.config'


const MICROSOFTGRAPH_TOKEN_ID = 'microsoftgraph'

const getOauth2TokenRoute = async ():Promise<Route> => {

  // secret variables
  const tenantId: string | undefined = await getSecret("O365-TENANT-ID")

  const TOKEN_HOST = 'login.microsoftonline.com'
  const TOKEN_PATH = `/${tenantId}/oauth2/token`
  const oauth2Options = await getOauth2Options()

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

  return oauth2TokenRoute
  
}

const getOauth2Options = async () => {
  // secret variables
  const tenantId: string | undefined = await getSecret("O365-TENANT-ID")
  const clientId: string | undefined = await getSecret("O365-CLIENT-ID")
  const clientSecret: string | undefined = await getSecret("O365-CLIENT-SECRET")
  
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

  return oauth2Options
}


const refreshToken = async () => {

  const response = await oauth2Request(await getOauth2Options())
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
  handler: proxyJsonRequestHandler(authorizationFactory, listUserCalendarsMapper)
}

const listUserEventsRoute: Route = {
  hosts,
  path: paths.listUserEventsPath,
  handler: proxyJsonRequestHandler(authorizationFactory, listUserEventsMapper)
}

const listCalendarEventsRoute: Route = {
  hosts,
  path: paths.listCalendarEventsPath,
  handler: proxyJsonRequestHandler(authorizationFactory, listUserEventsMapper)
}

const listCalendarViewRoute: Route = {
  hosts,
  path: paths.listCalendarViewPath,
  handler: proxyJsonRequestHandler(authorizationFactory, listUserEventsMapper)
}

export const enabled = !!(microsoftApiEnabled)

export default async () => {

  const oauth2TokenRoute = await getOauth2TokenRoute()
  return {
    enabled,
    routes: [
      listUserMessagesRoute,
      listUserCalendarsRoute,
      listUserEventsRoute,
      listCalendarEventsRoute,
      listCalendarViewRoute,
      oauth2TokenRoute
    ]
  }
}
