import { valueMapperFactory } from './value-mapper.factory'
import { schemaMapper } from './schema.mapper'

export const jsonMapper = <S, T>(schema: S) => async (data?: string): Promise<string> => {
  let json: Partial<T> = {}
  try {
    json = JSON.parse(data) || {}
  } catch (err) {}

  const valueMapper = await valueMapperFactory()
  const mapper = schemaMapper<S, Partial<T>>(schema, valueMapper)

  const result = mapper(json)
  return JSON.stringify(result)
}
