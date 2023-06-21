import { valueMapperFactory } from './value-mapper.factory'
import { schemaMapper } from './schema.mapper'
import { type Schema } from './interfaces'

export const jsonMapper = <T extends Record<string, any>> (schema: Schema<T> | Array<Schema<T>>) => async (data?: string): Promise<string> => {
  let json: Partial<T> = {}
  try {
    json = JSON.parse(data) || {}
  } catch (err) {
  }

  const valueMapper = await valueMapperFactory()
  const mapper = schemaMapper(schema, valueMapper)

  const result = mapper(json)
  return JSON.stringify(result)
}
