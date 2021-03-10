import * as fs from 'fs'
import listUserMessagesMapper from './mappers/list-user-messages.mapper'
import getUserMessageMapper from './mappers/get-user-message.mapper'
import listCalendarEventsMapper from './mappers/list-calendar-events.mapper'
import listUserCalendars from './mappers/list-user-calendars.mapper'
import { authorizationPathExtractorFactory } from './googleapis.service'
import proxyJsonRequestHandler from '../../proxy/handlers/proxy-json-request.handler'
import proxyBatchRequestHandler from '../../proxy/handlers/proxy-batch-request.handler'
import { Route } from '../../router/interfaces/router.interface'

import {
  scopes,
  hosts,
  paths,
  pathTransforms,
  clientEmail,
  privateKey
} from './googleapis.config'

const authorizationFactory = authorizationPathExtractorFactory(Object.values(paths))

const listUserMessagesRoute: Route = {
  hosts,
  path: paths.listUserMessagesPath,
  handler: proxyJsonRequestHandler(
    authorizationFactory,
    listUserMessagesMapper
  )
}

const getUserMessageRoute: Route = {
  hosts,
  path: paths.getUserMessagePath,
  handler: proxyJsonRequestHandler(
    authorizationFactory,
    getUserMessageMapper
  )
}

const listUserCalendarsRoute: Route = {
  hosts,
  path: paths.listUserCalendarsPath,
  handler: proxyJsonRequestHandler(
    authorizationFactory,
    listUserCalendars,
    pathTransforms.listUserCalendarsPath
  )
}

const listCalendarEventsRoute: Route = {
  hosts,
  path: paths.listCalendarEventsPath,
  handler: proxyJsonRequestHandler(
    authorizationFactory,
    listCalendarEventsMapper,
    pathTransforms.listCalendarEventsPath
  )
}

const gmailBatchRoute: Route = {
  hosts,
  path: paths.batchRequestPath,
  method: 'post',
  handler: proxyBatchRequestHandler(authorizationFactory, {
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
