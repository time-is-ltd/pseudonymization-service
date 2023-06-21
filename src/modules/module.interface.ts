import { type Route } from '../router/interfaces/router.interface'

export interface Module {
  enabled: boolean
  routes: Route[]
}
