import { AuthorizationFactory, BodyMapper, RequestHandler } from '../interfaces'

export const mapBodyMiddleware = (
  authorizationFactory: AuthorizationFactory,
  bodyMapper?: BodyMapper
): RequestHandler => async ({ body: rawBody, ...rest }) => {
  return new Promise(async (resolve) => {
    const body = typeof bodyMapper === 'function' && rawBody
      ? await bodyMapper(rawBody, authorizationFactory)
      : rawBody

    resolve({
      ...rest,
      body
    })
  })
}
