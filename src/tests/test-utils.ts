import Ajv from 'ajv'

const ajv = new Ajv()
const regexDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

export const containsNothingButDomains = (str: string) => {
  if (str == null) {
    return
  }

  for (const part of str.split(' ')) {
    if (!regexDomain.test(part)) { return false }
  }
  return true
}

export const overrideEnvs = (envs: Record<string, string>) => {
  Object.keys(envs).forEach((key) => {
    process.env[key] = envs[key]
  })
}

export const validateUsingSchema = (obj: Record<string, unknown>, schema: Record<string, unknown>) => {
  const validate = ajv.compile(schema)
  const valid = validate(obj)
  if (!valid) {
    console.log(validate.errors)
  }
  expect(valid).toBeTruthy()
}
