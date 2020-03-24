import {
  word,
  uuid,
  url,
  name,
  text,
  date,
  mimeType,
  number,
  fileName,
  boolean,
  email
} from './faker.helper'
import {
  TYPES,
  Schema
} from './mapper.helper'

export type Data<T> = {
  input: T,
  output: T
}

export const generate = <T>(schema: Schema<T> | Schema<T>[], overrides = {}) => {
  if (Array.isArray(schema)) {
    return schema
      .map((item, i) => {
        return generate(item)
      })
  } else if (schema === Object(schema)) {
    return Object
      .keys(schema)
      .reduce((obj, key) => {
        if (schema[key] == null) {
          return obj
        }
        const schemaType = typeof schema[key]
        if (schemaType === 'symbol') {
          switch (schema[key]) {
            case TYPES.String:
              obj[key] = word()
              break
            case TYPES.Id:
              obj[key] = uuid()
              break;
            case TYPES.Url:
              obj[key] = url()
              break
            case TYPES.Username:
              obj[key] = name()
              break
            case TYPES.Datetime:
              obj[key] = date()
              break
            case TYPES.ContentType:
              obj[key] = mimeType()
            case TYPES.Number:
              obj[key] = number(1000000)
              break
            case TYPES.Boolean:
              obj[key] = boolean()
              break
            case TYPES.Email:
              obj[key] = email()
              break
            case TYPES.ETag:
              const id = uuid().replace('-', '')
              obj[key] = `"${id}"`
              break
            case TYPES.Filename:
              obj[key] = fileName()
              break
            /*case TYPES.StringArray:
              obj[key] = new Array(number(10))
                .fill(null)
                .map(_ => word())
              break
            case TYPES.PrivateArray:
              obj[key] = []
              break*/
          }
        } else if (schema[key]) {
          obj[key] = generate(schema[key])
        }
        return obj
      }, {})
  }

  return Array.isArray(schema) ? [] : {}
}
