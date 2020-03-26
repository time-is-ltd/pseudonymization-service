import { RequestHandler } from 'express'
import proxyReguest, { AuthorizationFactory, ProxyRequestDataMapper } from '../proxy-request'

type JsonRequestHandler = (
  authorizationFactory: AuthorizationFactory,
  dataMapper?: ProxyRequestDataMapper,
  urlTransform?: (url: string) => string
) => RequestHandler

const jsonRequestHandler: JsonRequestHandler = (authorizationFactory: AuthorizationFactory, dataMapper?: ProxyRequestDataMapper,
  urlTransform?: (url: string) => string) => (req, res, next) => {
  proxyReguest(
    authorizationFactory,
    dataMapper,
    undefined,
    urlTransform
  )(req, res, next)
}

export default jsonRequestHandler
