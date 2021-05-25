import listUserMessagesMapper from './mappers/list-user-messages.mapper'
import getUserMessageMapper from './mappers/get-user-message.mapper'
import listCalendarEventsMapper from './mappers/list-calendar-events.mapper'
import listUserCalendarsMapper from './mappers/list-user-calendars.mapper'
import listMeetRecordsMapper from './mappers/list-meet-reports.mapper'
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
  hosts: hosts.gmail,
  path: paths.listUserMessagesPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUserMessagesMapper
  })
}

const getUserMessageRoute: Route = {
  hosts: hosts.gmail,
  path: paths.getUserMessagePath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: getUserMessageMapper
  })
}

const listUserCalendarsRoute: Route = {
  hosts: hosts.calendar,
  path: paths.listUserCalendarsPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUserCalendarsMapper,
    urlTransform: pathTransforms.listUserCalendarsPath
  })
}

const listCalendarEventsRoute: Route = {
  hosts: hosts.calendar,
  path: paths.listCalendarEventsPath,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listCalendarEventsMapper,
    urlTransform: pathTransforms.listCalendarEventsPath
  })
}

const gmailBatchRoute: Route = {
  hosts: hosts.gmail,
  path: paths.batchRequestPath,
  method: 'post',
  handler: batchHandler(authorizationFactory, {
    [paths.listUserMessagesPath]: listUserMessagesMapper,
    [paths.getUserMessagePath]: getUserMessageMapper
  })
}

const listMeetRecordsRoute: Route = {
  hosts: hosts.admin,
  path: paths.listMeetReports,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listMeetRecordsMapper
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
      listCalendarEventsRoute,
      listMeetRecordsRoute
    ]
  }
}
