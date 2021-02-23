import { RequestHandler } from 'express'
import { AuthorizationFactory, DataMapper } from '../interfaces'
import proxyReguest from '../proxy-request'

type JsonRequestHandler = (
  authorizationFactory: AuthorizationFactory,
  dataMapper?: DataMapper,
  urlTransform?: (url: string) => string
) => RequestHandler

const jsonRequestHandler: JsonRequestHandler = (authorizationFactory: AuthorizationFactory, dataMapper?: DataMapper,
  urlTransform?: (url: string) => string) => (req, res, next) => {
  proxyReguest(
    authorizationFactory,
    dataMapper,
    undefined,
    urlTransform
  )(req, res, next)
}

export default jsonRequestHandler
