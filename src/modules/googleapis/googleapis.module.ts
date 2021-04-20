import listUserMessagesMapper from './mappers/list-user-messages.mapper'
import getUserMessageMapper from './mappers/get-user-message.mapper'
import listCalendarEventsMapper from './mappers/list-calendar-events.mapper'
import listUserCalendars from './mappers/list-user-calendars.mapper'
import { authorizationPathExtractorFactory } from './googleapis.service'
import { proxyFactory } from '../../proxy'
import { Route } from '../../router/interfaces/router.interface'
import {
  scopes,
  hosts,
  paths,
  pathTransforms,
  clientEmail,
  privateKey
} from './googleapis.config'
import batchHandler from './handlers/batch.handler'

const authorizationFactory = authorizationPathExtractorFactory(Object.values(paths))

const listUserMessagesRoute: Route = {
  hosts,
  path: paths.listUserMessagesPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUserMessagesMapper
  })
}

const getUserMessageRoute: Route = {
  hosts,
  path: paths.getUserMessagePath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: getUserMessageMapper
  })
}

const listUserCalendarsRoute: Route = {
  hosts,
  path: paths.listUserCalendarsPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUserCalendars,
    urlTransform: pathTransforms.listUserCalendarsPath
  })
}

const listCalendarEventsRoute: Route = {
  hosts,
  path: paths.listCalendarEventsPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listCalendarEventsMapper,
    urlTransform: pathTransforms.listCalendarEventsPath
  })
}

const gmailBatchRoute: Route = {
  hosts,
  path: paths.batchRequestPath,
  method: 'post',
  handler: batchHandler(authorizationFactory, {
    [paths.listUserMessagesPath]: listUserMessagesMapper,
    [paths.getUserMessagePath]: getUserMessageMapper
  })
}

export default async () => {
  const enabledPromiseAll = await Promise.all([scopes, clientEmail, privateKey])

  const enabled = enabledPromiseAll
    .reduce((result, item) => {
      return result && Boolean(item)
    }, true)
  
  console.info(`[Module/Google API]: ${enabled ? 'enabled' : 'disabled' }`)

  return {
    enabled,
    routes: [
      listUserMessagesRoute,
      getUserMessageRoute,
      gmailBatchRoute,
      listUserCalendarsRoute,
      listCalendarEventsRoute
    ]
  }
}
