import { type Request } from './request.interface'

export type RequestHandler = (request: Request) => Promise<Request>
