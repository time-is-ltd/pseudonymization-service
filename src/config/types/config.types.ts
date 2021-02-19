export type TransformMapValueFunc = (str?: string) => any
export type TransformMapValueObj = {
  transform: TransformMapValueFunc
  ttl?: number
}
export type TransformMapValue = TransformMapValueFunc | TransformMapValueObj
export type TransformMap = Record<string, TransformMapValue>

export type Response<T extends TransformMap, K extends keyof T> = T[K] extends TransformMapValueFunc
  ? ReturnType<T[K]>
  : T[K] extends TransformMapValueObj
    ? ReturnType<T[K]['transform']>
    : unknown
