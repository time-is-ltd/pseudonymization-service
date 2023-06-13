import { TYPES } from './constants'
import { type Schema } from './interfaces'

export type ValueMapper = (type: symbol, value: unknown) => unknown

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

  const isArray = sortedTypes.includes(TYPES.Array)
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

export const schemaMapper = <T extends Record<string, any>> (schema: Schema<T> | Array<Schema<T>>, valueMapper: ValueMapper) => (value?: Partial<T> | Array<Partial<T>>): unknown => {
  if (!value) {
    return
  }

  if (Array.isArray(schema) && Array.isArray(value)) {
    // Find index key name
    let isIndexed = false
    let indexedPropertyName
    const firstSchemaItem = schema[0]
    if (firstSchemaItem === Object(firstSchemaItem)) {
      for (const key in firstSchemaItem) {
        if (Object.prototype.hasOwnProperty.call(firstSchemaItem, key)) {
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
      const indexMap: Record<string, Schema<T>> = schema
        .reduce((indexMap, item) => {
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
            return undefined
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
        const schemaElement = schema[key]
        const valueElement = value[key]

        if (valueElement === undefined) {
          return obj
        }

        if (Array.isArray(schemaElement) && typeof schemaElement[0] === 'symbol') {
          obj[key] = getValue(valueMapper)(schemaElement as symbol[], valueElement)
        } else if (typeof schemaElement === 'symbol') {
          obj[key] = valueMapper(schemaElement, valueElement)
        } else if (typeof schemaElement === 'string') {
          if (schemaElement === normalizeIndexName(valueElement)) {
            obj[key] = valueElement
          } else {
            obj[key] = schemaElement
          }
        } else if (typeof schemaElement === 'number') {
          obj[key] = schemaElement
        } else if (valueElement) {
          obj[key] = schemaMapper(schemaElement as Record<string, any>, valueMapper)(valueElement as Record<string, any>)
        }
        return obj
      }, {})
  }

  return Array.isArray(value) ? [] : {}
}
