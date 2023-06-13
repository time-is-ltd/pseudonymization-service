import { type AuthorizationFactory, type BodyMapper, type RequestHandler } from '../interfaces'

export const mapBodyMiddleware = (
  authorizationFactory: AuthorizationFactory,
  bodyMapper?: BodyMapper
): RequestHandler => async ({ body: rawBody, ...rest }) => {
  const body = typeof bodyMapper === 'function' && rawBody
    ? await bodyMapper(rawBody, authorizationFactory)
    : rawBody

  return {
    ...rest,
    body
  }
}
