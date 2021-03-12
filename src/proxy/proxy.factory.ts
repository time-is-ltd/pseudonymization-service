import { IncomingMessage, ServerResponse } from 'http'
import { decryptUrlMiddleware, mapBodyMiddleware, modifyHeadersMiddleware, transformUrlMiddleware } from './middlewares'
import { AuthorizationFactory, DataMapper, BodyMapper } from './interfaces'
import { receiveBody } from './helpers'
import { sendResponseFactory } from './helpers/send-response-factory.helper'
import { request as makeRequest, RequestError, RequestOptions } from '../request'

interface ProxyParams {
  authorizationFactory: AuthorizationFactory
  dataMapper: DataMapper
  bodyMapper?: BodyMapper
  urlTransform?: (url: string) => string
}

export const proxyFactory = (params: ProxyParams) => async (req: IncomingMessage, res: ServerResponse, _) => {
  const {
    authorizationFactory,
    dataMapper,
    bodyMapper,
    urlTransform = url => url
  } = params

  const sendResponse = sendResponseFactory(res)
  Promise
    .resolve(req)
    .then(receiveBody())
    .then(mapBodyMiddleware(authorizationFactory, bodyMapper))
    .then(decryptUrlMiddleware())
    .then(modifyHeadersMiddleware(authorizationFactory))
    .then(transformUrlMiddleware(urlTransform))
    .then(async request => {
      const { method, headers, body, originalRequest, url } = request
      const options: RequestOptions = {
        method,
        headers,
        data: body?.length > 0 ? body : undefined
      }

      const response = await makeRequest(url, options)
      const originalBody = originalRequest.body
      return {
        originalBody,
        response
      }
    })
    .then(async ({ originalBody, response }) => {
      const { headers, statusCode, statusMessage } = response
      const data = await dataMapper(response.data, originalBody)

      sendResponse({
        headers,
        statusCode,
        statusMessage,
        data
      })
    })
    .catch(err => {
      console.log(err)
      if (err instanceof RequestError) {
        const { statusCode, statusMessage } = err
        return sendResponse({
          statusCode,
          statusMessage
        })
      }
  
      // Unknown error
      sendResponse({
        statusCode: 500,
        statusMessage: 'Unknown error'
      })
    })
}
