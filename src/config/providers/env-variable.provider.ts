import { toSnakeCase } from '../transformers'
import { type TransformMap } from '../types'
import { logger, VerboseLevel } from '../../logger'

const getEnvVariableName = <T extends TransformMap, K extends keyof T> (key: K): string => {
  return toSnakeCase(key as string).toUpperCase()
}

export const fromEnvVariable = <T extends TransformMap> () => async <K extends keyof T> (key: K) => {
  const name = getEnvVariableName<T, K>(key)
  logger(VerboseLevel.V, `[Config/ENV]: Loading key ${String(key)}`)
  const value = process.env[name]
  if (value) {
    logger(VerboseLevel.V, `[Config/ENV]: ${String(key)} loaded`)
  }
  return value
}
