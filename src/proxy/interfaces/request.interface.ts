import { IncomingHttpHeaders } from 'http'

export interface Request {
  url: string
  protocol: string
  method: string
  headers: IncomingHttpHeaders
  body?: string
}
