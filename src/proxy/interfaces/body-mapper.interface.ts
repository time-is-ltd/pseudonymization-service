import { AuthorizationFactory } from './authorization-factory.interface'

export type BodyMapper = (body: string, authorizationFactory: AuthorizationFactory) => Promise<string>
