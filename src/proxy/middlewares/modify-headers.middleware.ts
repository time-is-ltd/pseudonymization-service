import { RequestHandler, AuthorizationFactory } from '../interfaces'

export const modifyHeadersMiddleware = (authorizationFactory: AuthorizationFactory, throwException = true): RequestHandler => async ({ headers, url, ...rest }) => {
  const modifiedHeaders = { ...headers }

  // Remove headers
  delete modifiedHeaders.host
  delete modifiedHeaders['content-length']
  delete modifiedHeaders.authorization

  // Add authorization
  try {
    const authorization = await authorizationFactory(url)
    if (authorization) {
      modifiedHeaders.authorization = authorization
    }
  } catch (err) {
    if (throwException) {
      throw err
    }
  }

  // Replace proxy host with target host (e.g. localhost:8080 with www.googleapis.com)
  modifiedHeaders.host = url.split('/')[1]

  return {
    ...rest,
    url,
    headers: modifiedHeaders
  }
}
