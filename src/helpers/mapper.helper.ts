import { email, filename, id, url } from '../anonymizer'
import config from '../app.config'

/*
  Extracts primitive type

  Ej:
  type T0 = Unpacked<string> // string
  type T1 = Unpacked<string[]> // string
  type T2 = Unpacked<() => string> // string
  type T3 = Unpacked<Promise<string>> // string
  type T4 = Unpacked<Promise<string>[]> // Promise<string>
  type T5 = Unpacked<Unpacked<Promise<string>[]>> // string
*/
type Unpacked<T> =
  T extends (infer U)[] ? U :
  T extends (...args: any[]) => infer U ? U :
  T extends Promise<infer U> ? U :
  T

/*
 Replaces recursively property type with symbol | string | number
  ej:
  type T0 = Schema<{
    id: string,
    items: Array<{
      id: string,
      createdAt: string,
      price: number
    }>,
    tags: string[]
  }> // {
    id: symbol | string | number,
    items: Array<{
      id: symbol | string | number,
      createdAt: symbol | string | number,
      price: symbol | string | number
    }>,
    tags: symbol | string | number
  }
*/
export type Schema<T> = {
  [P in keyof T]:
    Unpacked<T[P]> extends (infer U)[] ? Schema<U>[] :
    Unpacked<T[P]> extends object ? Schema<T[P]> :
    symbol | string | number | symbol[]
}

export type ValueMapper = (type: Symbol, value: any) => any

const isStringOrNumber = value => typeof value === 'string' || typeof value === 'number'

const normalizeIndexName = name => (name || '').toLocaleLowerCase()

const string = value => typeof value === 'string' ? String(value) : ''
const boolean = value => typeof value === 'boolean' ? value : false
const number = value => typeof value === 'number' ? value : 0

export const TYPES = {
  // String values
  String: Symbol('String'),
  Text: Symbol('Text'),
  Id: Symbol('Id'),
  ContentType: Symbol('ContentType'),
  Datetime: Symbol('Datetime'),
  Email: Symbol('Email'),
  ETag: Symbol('ETag'),
  Filename: Symbol('Filename'),
  Url: Symbol('Url'),
  Username: Symbol('Username'),

  // Numeric values
  Number: Symbol('Number'),

  // Boolean avalues
  Boolean: Symbol('Boolean'),
  
  // Other
  Private: Symbol('Private'),
  Array: Symbol('Array'),
}


const TYPE_PRIORITY_MAP = {
  [TYPES.Array.toString()]: 100,
  [TYPES.Private.toString()]: 50
}

const getTypePriority = (type: symbol) => {
  return TYPE_PRIORITY_MAP[type.toString()] || 0
}

const getValue = (valueMapper: ValueMapper) => (types: symbol[], value: any) => {
  const sortedTypes = types.sort((a, b) => {
    const aPriority = getTypePriority(a)
    const bPriority = getTypePriority(b)
    return bPriority - aPriority
  })

  const isArray = sortedTypes.indexOf(TYPES.Array) > -1
  return sortedTypes.reduce((value, type) => {
    if (isArray && type !== TYPES.Array) {
      return value
        .map(val => valueMapper(type, val))
        .filter(val => val !== undefined)
    } else {
      return valueMapper(type, value)
    }
  }, value)
}

export const buildMapper = <S extends Object, T extends Object>(schema: S, valueMapper: ValueMapper) => (value?: T): any => {
  if (!value) {
    return
  }

  if (Array.isArray(schema) && Array.isArray(value)) {
    // Find index key name
    let isIndexed = false
    let indexedPropertyName
    const firstSchemaItem = schema[0]
    if (firstSchemaItem === Object(firstSchemaItem)) {
      for (let key in firstSchemaItem) {
        if (firstSchemaItem.hasOwnProperty(key)) {
          const value = firstSchemaItem[key]
          if (isStringOrNumber(value)) {
            isIndexed = true
            indexedPropertyName = key
            break
          }
        }
      }
    }

    if (isIndexed) {
      const indexMap: { [key: string]: S } = schema
        .reduce((indexMap, item)=> {
          const indexName = normalizeIndexName(item[indexedPropertyName])
          indexMap[indexName] = item
          return indexMap
        }, {})

      // Filter by index value
      return value
        .map(item => {
          const indexValue = normalizeIndexName(item[indexedPropertyName])
          const indexedSchema = indexMap[indexValue]
          if (!indexedSchema) {
            return
          }

          return buildMapper(indexedSchema, valueMapper)(item)
        })
        .filter(item => !!item)
    } else if (schema.length === 1) {
      // Apply schema to every item
      return value.map(item => buildMapper(schema[0], valueMapper)(item))
    }

    return []
  } else if (schema === Object(schema) && value === Object(value)) {
    return Object
      .keys(schema)
      .reduce((obj, key) => {
        if (value[key] === undefined) {
          return obj
        }

        const schemaType = typeof schema[key]
        if (Array.isArray(schema[key]) && typeof schema[key][0] === 'symbol') {
          obj[key] = getValue(valueMapper)(schema[key], value[key])
        } else if (schemaType === 'symbol') {
          obj[key] = valueMapper(schema[key], value[key])
        } else if (schemaType === 'string') {
          if (schema[key] === normalizeIndexName(value[key])) {
            obj[key] = value[key]
          } else {
            obj[key] = schema[key]
          }
        } else if (schemaType === 'number') {
          obj[key] = schema[key]
        } else if (value[key]) {
          obj[key] = buildMapper(schema[key], valueMapper)((value[key]))
        }
        return obj
      }, {})
  }

  return Array.isArray(value) ? [] : {}
}

export const getValueMapper = async () => {
  const [
    anonymizeInternalEmailUsername,
    anonymizeExternalEmailUsername,
    anonymizeInternalEmailDomain,
    anonymizeExternalEmailDomain,
    internalDomainList,
    anonymizationSalt,
    rsaPublicKey
  ] = await Promise.all([
    config.anonymizeInternalEmailUsername,
    config.anonymizeExternalEmailUsername,
    config.anonymizeInternalEmailDomain,
    config.anonymizeExternalEmailDomain,
    config.internalDomainList,
    config.anonymizationSalt,
    config.rsaPublicKey
  ])

  return (type: Symbol, value: any) => {
    switch (type) {
      case TYPES.Private:
        return undefined
      case TYPES.Array:
        return Array.isArray(value) ? value : []
      case TYPES.Text:
      case TYPES.String:
      case TYPES.Datetime:
      case TYPES.ContentType:
      case TYPES.ETag:
      case TYPES.Username:
        return string(value)
      case TYPES.Number:
        return number(value)
      case TYPES.Boolean:
        return boolean(value)
      case TYPES.Url:
        return url(value, rsaPublicKey)
      case TYPES.Id:
        const idConfig = {
          rsaPublicKey,
          anonymizationSalt
        }

        return id(value, idConfig)
      case TYPES.Email:
        const emailConfig = {
          anonymizeInternalEmailUsername,
          anonymizeExternalEmailUsername,
          anonymizeInternalEmailDomain,
          anonymizeExternalEmailDomain,
          internalDomainList,
          anonymizationSalt
        }

        return email(value, emailConfig)
      case TYPES.Filename:
        return filename(value)
    }
  
    return undefined
  }
}

export const jsonMapper = <S, T>(schema: any) => async (data?: string): Promise<string> => {
  let json: Partial<T> = {}
  try {
    json = JSON.parse(data) || {}
  } catch (err) {}

  const valueMapper = await getValueMapper()
  const mapper = buildMapper<S, Partial<T>>(schema, valueMapper)

  const result = mapper(json)
  return JSON.stringify(result)
}
