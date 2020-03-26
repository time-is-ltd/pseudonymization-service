import { RequestHandler } from 'express'

export interface Route {
  hosts: string[],
  path: string,
  handler: RequestHandler | RequestHandler[],
  requireAuth?: boolean,
  method?: 'get' | 'post' | 'put'
}