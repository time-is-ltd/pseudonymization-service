import { toSnakeCase } from '../transformers'
import { TransformMap } from '../types'

const getEnvVariableName = <T extends TransformMap, K extends keyof T>(key: K): string => {
  return toSnakeCase(key as string).toUpperCase()
}

export const fromEnvVariable = <T extends TransformMap>() => async <K extends keyof T>(key: K) => {
  const name = getEnvVariableName<T, K>(key)
  const value = process.env[name]
  return value
}
