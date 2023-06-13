import { type IncomingHttpHeaders } from 'http'

export interface RequestPayload {
  url: string
  protocol: string
  method: string
  headers: IncomingHttpHeaders
  body?: string
}

export interface Request extends RequestPayload {
  originalRequest?: RequestPayload
}
