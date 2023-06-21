import {
  getUserMessageMapper,
  listActivityReportsDriveMapper,
  listActivityReportsMeetMapper,
  listCalendarEventsMapper,
  listUsageReportsMapper,
  listUserCalendarsMapper,
  listUserMessagesMapper
} from './mappers'
import { authorizationPathExtractorFactory } from './googleapis.service'
import { proxyFactory } from '../../proxy'
import { type Route } from '../../router/interfaces/router.interface'
import { clientEmail, hosts, paths, pathTransforms, privateKey, scopes } from './googleapis.config'
import batchHandler from './handlers/batch.handler'
import { type Module } from '../module.interface'

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

const listActivityReportsMeetRoute: Route = {
  hosts: hosts.admin,
  path: paths.listActivityReportsMeet,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listActivityReportsMeetMapper
  })
}

const listActivityReportsDriveRoute: Route = {
  hosts: hosts.admin,
  path: paths.listActivityReportsDrive,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listActivityReportsDriveMapper
  })
}

const listUsageReportsRoute: Route = {
  hosts: hosts.admin,
  path: paths.listUsageReports,
  handler: proxyFactory({
    authorizationFactory,
    dataMapper: listUsageReportsMapper
  })
}

export default async (): Promise<Module> => {
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
      listActivityReportsMeetRoute,
      listActivityReportsDriveRoute,
      listUsageReportsRoute
    ]
  }
}
