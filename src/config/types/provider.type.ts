import { type TransformMap } from '../types'

export interface ProviderResult<T = unknown> { defaultTtl?: number, v?: T }
export type Provider<T extends TransformMap, K extends keyof T> = (key: K) => Promise<unknown | ProviderResult>
