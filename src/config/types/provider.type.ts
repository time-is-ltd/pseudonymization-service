import { TransformMap } from '../types'

export interface ProviderResult<T extends unknown = unknown> { defaultTtl?: number, v?: T }
export type Provider<T extends TransformMap, K extends keyof T> = (key: K) => Promise<unknown | ProviderResult>
