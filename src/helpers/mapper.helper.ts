import { email, filename } from './anonymization.helper'

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

const isStringOrNumber = value => typeof value === 'string' || typeof value === 'number'

const normalizeIndexName = name => (name || '').toLocaleLowerCase()

const string = value => typeof value === 'string' ? String(value) : ''
const boolean = value => typeof value === 'boolean' ? value : false
const number = value => typeof value === 'number' ? value : 0
const stringArray = value => (Array.isArray(value) ? value : []).map(value => string(value))

const BASE_TYPES = {
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
  Array: Symbol('Array')
}

const TYPE_ALIASES = {
  PrivateString: [
    BASE_TYPES.Private,
    BASE_TYPES.String
  ],
  PrivateText: [
    BASE_TYPES.Private,
    BASE_TYPES.Text
  ]
}

export const TYPES = {
  ...BASE_TYPES,
  ...TYPE_ALIASES
}


const TYPE_PRIORITY_MAP = {
  [BASE_TYPES.Array.toString()]: 100,
  [BASE_TYPES.Private.toString()]: 50
}

const getTypePriority = (type: symbol) => {
  return TYPE_PRIORITY_MAP[type.toString()] || 0
}

const getValue2 = (type: Symbol, value: any) => {
  switch (type) {
    case BASE_TYPES.Private:
      return undefined
    case BASE_TYPES.Array:
      return Array.isArray(value) ? value : []
    case BASE_TYPES.Text:
    case BASE_TYPES.String:
    case BASE_TYPES.Datetime:
    case BASE_TYPES.Id:
    case BASE_TYPES.ContentType:
    case BASE_TYPES.ETag:
    case BASE_TYPES.Url:
    case BASE_TYPES.Username:
      return string(value)
    case BASE_TYPES.Number:
      return number(value)
      break
    case BASE_TYPES.Boolean:
      return boolean(value)
    case BASE_TYPES.Email:
      return email(value)
    case BASE_TYPES.Filename:
      return filename(value)
  }

  return undefined
}

const getValue = (types: symbol[], value: any) => {
  const sortedTypes = types.sort((a, b) => {
    const aPriority = getTypePriority(a)
    const bPriority = getTypePriority(b)
    return bPriority - aPriority
  })

  const isArray = sortedTypes.indexOf(BASE_TYPES.Array) > -1
  return sortedTypes.reduce((value, type) => {
    if (isArray && type !== BASE_TYPES.Array) {
      return value
        .map(val => getValue2(type, val))
        .filter(val => val !== undefined)
    } else {
      return getValue2(type, value)
    }
  }, value)
}

export const buildMapper = <S extends Object, T extends Object>(schema: S) => (value?: T): any => {
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

          return buildMapper(indexedSchema)(item)
        })
        .filter(item => !!item)
    } else if (schema.length === 1) {
      // Apply schema to every item
      return value.map(item => buildMapper(schema[0])(item))
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
          obj[key] = getValue(schema[key], value[key])
        } else if (schemaType === 'symbol') {
          obj[key] = getValue2(schema[key], value[key])
        } else if (schemaType === 'string') {
          if (schema[key] === normalizeIndexName(value[key])) {
            obj[key] = value[key]
          } else {
            obj[key] = schema[key]
          }
        } else if (schemaType === 'number') {
          obj[key] = schema[key]
        } else if (value[key]) {
          obj[key] = buildMapper(schema[key])((value[key]))
        }
        return obj
      }, {})
  }

  return Array.isArray(value) ? [] : {}
}

const getLinks = (obj: any) => {
  const str = JSON.stringify(obj)
  const links = str.match(/\:\/\/([a-z0-9-_]+(\.[a-z0-9-_]+)+(\/hangouts|\/meet|\/calls){0,1})/gmi)

  return links || []
}

type EnrichmentType = 'links'
type JsonMapperConfig<T> = {
  iterateOnKey?: keyof T,
  enrichWith?: EnrichmentType[]
}

const enrichObject = (obj: any, types: EnrichmentType[] = []) => {
  if (types.length === 0) {
    return {}
  }

  const shouldHaveLinks = types.indexOf('links') > -1

  let result = {}
  if (shouldHaveLinks) {
    const links = getLinks(obj)
    if (links.length > 0) {
      result['@til.links'] = [...new Set(links)]
    }
  }

  return {
    ...result
  }
}

export const jsonMapper = <S, T>(schema: any, config: JsonMapperConfig<T> = {}) => async (data?: string): Promise<string> => {
  const { iterateOnKey, enrichWith } = config

  let json: Partial<T> = {}
  try {
    json = JSON.parse(data) || {}
  } catch (err) {}

  // @TODO: refactor
  // Iteration key is not known
  if (!iterateOnKey) {
    // Response is an array
    if (Array.isArray(json) && Array.isArray(schema)) {
      const itemSchema = schema[0]
      const mapper = buildMapper<S, Partial<T>>(itemSchema)
      const result = json.map(item => {
        const mappedJson = mapper(item)
        return {
          ...mappedJson,
          ...enrichObject(json, enrichWith)
        }
      })
      return JSON.stringify(result)
    }

    // Response is an object
    const mapper = buildMapper<S, Partial<T>>(schema)
    const mappedJson = mapper(json)
    const result = {
      ...mappedJson,
      ...enrichObject(json, enrichWith)
    }

    return JSON.stringify(result)
  }

  // Iterate on specified key
  const { [iterateOnKey]: itemSchema, ...restSchema } = schema
  const { [iterateOnKey]: items, ...rest } = json

  const rootMapper = buildMapper<S, Partial<T>>(restSchema)
  const itemMapper = buildMapper<S, Partial<T>>(itemSchema[0])

  const result = rootMapper(json)
  if (Array.isArray(items)) {
    result[iterateOnKey] = items.map(item => {
      const mappedItem = itemMapper(item)
      return {
        ...mappedItem,
        ...enrichObject(item, enrichWith)
      }
    })
  } else {
    result[iterateOnKey] = items
  }

  return JSON.stringify(result)
}
