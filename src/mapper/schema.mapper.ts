import { TYPES } from './constants'

export type ValueMapper = (type: Symbol, value: unknown) => unknown

const isStringOrNumber = value => typeof value === 'string' || typeof value === 'number'

const isIndexable = value => isStringOrNumber(value) || (
  Array.isArray(value) && value.reduce((b, i) => b && isStringOrNumber(i), true)
)

const normalizeIndexName = name => (name || '').toLocaleLowerCase()

const TYPE_PRIORITY_MAP = {
  [TYPES.Array.toString()]: 100,
  [TYPES.Hashed.toString()]: 75,
  [TYPES.Private.toString()]: 50,
  [TYPES.Passthrough.toString()]: 25
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

export const schemaMapper = <S extends Object, T extends Object>(schema: S, valueMapper: ValueMapper) => (value?: T): unknown => {
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
          if (isIndexable(value)) {
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
          const indexNameOrArray = item[indexedPropertyName]
          const indexNames = Array.isArray(indexNameOrArray)
            ? indexNameOrArray
            : [indexNameOrArray]

          indexNames.forEach(indexName => {
            const normalizedIndexName = normalizeIndexName(indexName)
            indexMap[normalizedIndexName] = {
              ...item,
              // Replace array with indexed value
              // e.g. replaces { name: ['view', 'edit'] } with { name: 'view' }
              [indexedPropertyName]: indexName
            }
          })
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

          return schemaMapper(indexedSchema, valueMapper)(item)
        })
        .filter(item => !!item)
    } else if (schema.length === 1) {
      // Apply schema to every item
      return value.map(item => schemaMapper(schema[0], valueMapper)(item))
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
          obj[key] = schemaMapper(schema[key], valueMapper)((value[key]))
        }
        return obj
      }, {})
  }

  return Array.isArray(value) ? [] : {}
}
