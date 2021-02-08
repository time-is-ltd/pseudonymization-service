import * as fs from 'fs'
import listUserMessagesMapper from './mappers/list-user-messages.mapper'
import getUserMessageMapper from './mappers/get-user-message.mapper'
import listCalendarEventsMapper from './mappers/list-calendar-events.mapper'
import listUserCalendars from './mappers/list-user-calendars.mapper'
import proxyJsonRequestHandler from '../../proxy/handlers/proxy-json-request.handler'
import proxyBatchRequestHandler from '../../proxy/handlers/proxy-batch-request.handler'
import { getPathPartFactory } from '../../helpers/path.helper'
import { Route } from '../../router/interfaces/router.interface'
import { authorizationPathExtractorFactory } from './googleapis.service'

import {
  scopes,
  hosts,
  paths,
  pathTransforms,
  clientEmail,
  privateKey
} from './googleapis.config'

// Path userId extractor map
const pathExtractorMap = Object
  .keys(paths)
  .reduce((obj, key) => {
    const path = paths[key]
    obj[path] = getPathPartFactory(path, 1)
    return obj
  }, {})

const authorizationFactory = authorizationPathExtractorFactory(pathExtractorMap)

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
