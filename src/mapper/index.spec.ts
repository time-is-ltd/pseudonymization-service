import { TYPES } from './constants'
import { schemaMapper } from './schema.mapper'
import { valueMapperFactory } from './value-mapper.factory'
import {
  ANONYMIZED_FILENAME,
  ANONYMIZED_EMAIL
} from '../helpers/testing'
jest.mock('../anonymizer')

test('Falsy values', async () => {
  const valueMapper = await valueMapperFactory()
  const mapper = schemaMapper({}, valueMapper)
  expect(mapper(null)).toBe(undefined)
  expect(mapper(undefined)).toBe(undefined)
  expect(mapper()).toBe(undefined)
  expect(mapper('')).toBe(undefined)
  expect(mapper(false)).toBe(undefined)
})

const TEST_PROPERTY_NAME = 'test'
const TEST_STRING_VALUE = 'TEsT value'

const buildTest = async (
  types: Array<symbol[]> | symbol[],
  inputValues: any[],
  outputValues: any[]
) => {
  const valueMapper = await valueMapperFactory()
  types.forEach(type => {
    const schema = { test: type }
    inputValues.forEach((inputValue, i) => {
      const outputValue = outputValues[i]
      const input = { [TEST_PROPERTY_NAME]: inputValue }
      const output = { [TEST_PROPERTY_NAME]: outputValue }

      const mapper = schemaMapper<typeof schema, typeof input>(schema, valueMapper)
      expect(mapper(input)).toMatchObject(output)
    })
  })
}

const inputValues = [
  TEST_STRING_VALUE,
  true,
  false,
  '',
  null,
  0,
  100,
  [TEST_STRING_VALUE, TEST_STRING_VALUE]
]

test('Map string property', () => {
  const types = [
    TYPES.String,
    TYPES.Datetime,
    TYPES.Id,
    TYPES.ContentType,
    TYPES.ETag,
    TYPES.Url
  ]
  const outputValues = [
    TEST_STRING_VALUE,
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map private string property', () => {
  const types = [
    [
      TYPES.Text,
      TYPES.Private
    ],
    [
      TYPES.Url,
      TYPES.Private
    ],
    [
      TYPES.Username,
      TYPES.Private
    ]
  ]

  const outputValues = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map numeric property', () => {
  const types = [
    TYPES.Number
  ]
  const outputValues = [
    0,
    0,
    0,
    0,
    0,
    0,
    100,
    0
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map private numeric property', () => {
  const types = [
    [
      TYPES.Private,
      TYPES.Number
    ]
  ]
  const outputValues = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map boolean property', () => {
  const types = [
    TYPES.Boolean
  ]
  const outputValues = [
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map private boolean property', () => {
  const types = [
    [
      TYPES.Private,
      TYPES.Boolean
    ]
  ]
  const outputValues = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map email property', () => {
  const types = [
    TYPES.Email
  ]
  const outputValues = [
    ANONYMIZED_EMAIL,
    ANONYMIZED_EMAIL,
    ANONYMIZED_EMAIL,
    ANONYMIZED_EMAIL,
    ANONYMIZED_EMAIL,
    ANONYMIZED_EMAIL,
    ANONYMIZED_EMAIL,
    ANONYMIZED_EMAIL
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map filename property', () => {
  const types = [
    TYPES.Filename
  ]
  const outputValues = [
    ANONYMIZED_FILENAME,
    ANONYMIZED_FILENAME,
    ANONYMIZED_FILENAME,
    ANONYMIZED_FILENAME,
    ANONYMIZED_FILENAME,
    ANONYMIZED_FILENAME,
    ANONYMIZED_FILENAME,
    ANONYMIZED_FILENAME
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map string array property', () => {
  const types = [
    [
      TYPES.String,
      TYPES.Array
    ]
  ]
  const outputValues = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [TEST_STRING_VALUE, TEST_STRING_VALUE]
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map private array property', () => {
  const types = [
    [
      TYPES.Private,
      TYPES.Array
    ]
  ]
  const outputValues = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]

  buildTest(types, inputValues, outputValues)
})

test('Map private array property', () => {
  const types = [
    [
      TYPES.Private,
      TYPES.Array
    ]
  ]
  const outputValues = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]

  buildTest(types, inputValues, outputValues)
})

test('Complex schema', async () => {
  
  const baseSchema = {
    string: TYPES.String,
    id: TYPES.Id,
    created: TYPES.Datetime,
    mime: TYPES.ContentType,
    etag: TYPES.ETag,
    url: TYPES.Url,
    username: TYPES.Username,
    number: TYPES.Number,
    boolean: TYPES.Boolean,
    email: TYPES.Email,
    filename: TYPES.Filename,
    // Private
    privateUsername: [
      TYPES.Private,
      TYPES.Username
    ],
    privateUrl: [
      TYPES.Private,
      TYPES.Url
    ],
    privateString: [
      TYPES.Private,
      TYPES.String
    ],
    privateText: [
      TYPES.Private,
      TYPES.Text
    ],
    // Arrays
    stringArray: [
      TYPES.String,
      TYPES.Array
    ],
    numericArray: [
      TYPES.Number,
      TYPES.Array
    ],
    booleanArray: [
      TYPES.Boolean,
      TYPES.Array
    ],
    // Private arrays
    privateArray: [
      TYPES.Private,
      TYPES.Array
    ],
    privateStringArray: [
      TYPES.Private,
      TYPES.String,
      TYPES.Array
    ],
    privateNumericArray: [
      TYPES.Private,
      TYPES.Number,
      TYPES.Array
    ],
    privateBooleanArray: [
      TYPES.Private,
      TYPES.Boolean,
      TYPES.Array
    ]
  }
  
  const baseInput = {
    string: TEST_STRING_VALUE,
    id: TEST_STRING_VALUE,
    created: TEST_STRING_VALUE,
    mime: TEST_STRING_VALUE,
    etag: TEST_STRING_VALUE,
    url: TEST_STRING_VALUE,
    username: TEST_STRING_VALUE,
    number: 100,
    boolean: true,
    email: TEST_STRING_VALUE,
    filename: TEST_STRING_VALUE,
    privateUsername: TEST_STRING_VALUE,
    privateUrl: TEST_STRING_VALUE,
    privateString: TEST_STRING_VALUE,
    privateText: TEST_STRING_VALUE,
    stringArray: [TEST_STRING_VALUE],
    numericArray: [100],
    booleanArray: [true, false, TEST_STRING_VALUE],
    privateArray: [true, TEST_STRING_VALUE, -10],
    privateStringArray: [TEST_STRING_VALUE, TEST_STRING_VALUE],
    privateNumericArray: [100, 200, -10],
    privateBooleanArray: [false, true, 100]
  }

  const baseOutput = {
    string: TEST_STRING_VALUE,
    id: TEST_STRING_VALUE,
    created: TEST_STRING_VALUE,
    mime: TEST_STRING_VALUE,
    etag: TEST_STRING_VALUE,
    url: TEST_STRING_VALUE,
    username: TEST_STRING_VALUE,
    number: 100,
    boolean: true,
    email: ANONYMIZED_EMAIL,
    filename: ANONYMIZED_FILENAME,
    privateUsername: '',
    privateUrl: '',
    privateString: '',
    privateText: '',
    stringArray: [TEST_STRING_VALUE],
    privateArray: [],
    numericArray: [100],
    booleanArray: [true, false, false],
    privateStringArray: [],
    privateNumericArray: [],
    privateBooleanArray: []
  }

  const build = (template = {}, maxDepth = 5, depth = 0, schema = {}) => {
    let newSchema = {
      ...template
    }
    if (depth <= maxDepth) {
      newSchema = {
        ...newSchema,
        [`obj${depth}`]: build(schema, maxDepth, depth + 1, template),
        [`array${depth}`]: [
          build(schema, maxDepth, depth + 1, template)
        ]
      }
    }
    return newSchema
  }

  const schema = build(baseSchema)
  const input = build(baseInput)
  const output = build(baseOutput)

  const valueMapper = await valueMapperFactory()
  const mapper = schemaMapper<typeof schema, typeof input>(schema, valueMapper)
  expect(mapper(input)).toMatchObject(output)
})
