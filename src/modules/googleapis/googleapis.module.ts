import {
  listUserMessagesMapper,
  getUserMessageMapper,
  listCalendarEventsMapper,
  listUserCalendarsMapper,
  listMeetReportsMapper,
  listDriveReportsMapper
} from './mappers'
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

const listMeetReportsRoute: Route = {
  hosts: hosts.admin,
  path: paths.listMeetReports,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listMeetReportsMapper
  })
}

const listDriveReportsRoute: Route = {
  hosts: hosts.admin,
  path: paths.listDriveReports,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listDriveReportsMapper
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
      listMeetReportsRoute,
      listDriveReportsRoute
    ]
  }
}
