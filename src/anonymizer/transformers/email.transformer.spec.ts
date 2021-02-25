import { email, AnonymizeEmailConfig } from './email.transformer'
jest.mock('../../cache')

const configFactory = (
  internalUsername: boolean,
  internalDomain: boolean,
  externalUsername: boolean,
  externalDomain: boolean,
  taggingEnabled = false,
  internalDomainList: string[] = []
): AnonymizeEmailConfig => {
  return  {
    anonymizeInternalEmailUsername: internalUsername,
    anonymizeExternalEmailUsername: externalUsername,
    anonymizeInternalEmailDomain: internalDomain,
    anonymizeExternalEmailDomain: externalDomain,
    internalDomainList,
    anonymizationSalt: 'test',
    enableInternalEmailPlusAddressing: taggingEnabled,
    enableExternalEmailPlusAddressing: taggingEnabled
  }
}

const EXTERNAL_EMAIL = 'tesT+tag@ gmail.com'
const EXTERNAL_EMAIL_NORMALIZED = 'test+tag@gmail.com'
const EXTERNAL_EMAIL_NORMALIZED_FULL_HASH = '113425833dd4cf70@c813bbe57db2f770.hash'
const EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH = 'test+tag@c813bbe57db2f770.hash'
const EXTERNAL_EMAIL_NORMALIZED_USERNAME_HASH = '113425833dd4cf70@gmail.com'
const EXTERNAL_EMAIL_WITH_PLUS_SIGN_ADDRESSING_NORMALIZED_FULL_HASH = '125d6d03b32c84d4+b912d403e9e84553@c813bbe57db2f770.hash'

const INTERNAL_DOMAINS = ['domain.com', 'anotherdomain.eu']
const INTERNAL_EMAIL = 'TeSt+TaG @DomAin .Com'
const INTERNAL_EMAIL_NORMALIZED = 'test+tag@domain.com'
const INTERNAL_EMAIL_NORMALIZED_FULL_HASH = '113425833dd4cf70@38d33d5e968778af.hash'
const INTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH = 'test+tag@38d33d5e968778af.hash'
const INTERNAL_EMAIL_NORMALIZED_USERNAME_HASH = '113425833dd4cf70@domain.com'
const INTERNAL_EMAIL_WITH_PLUS_SIGN_ADDRESSING_NORMALIZED_FULL_HASH = '125d6d03b32c84d4+b912d403e9e84553@38d33d5e968778af.hash'

const emails = [
  EXTERNAL_EMAIL,
  EXTERNAL_EMAIL_NORMALIZED,
  INTERNAL_EMAIL,
  INTERNAL_EMAIL_NORMALIZED
]

test('Do not anonymize username and domain', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED,
    EXTERNAL_EMAIL_NORMALIZED,
    INTERNAL_EMAIL_NORMALIZED,
    INTERNAL_EMAIL_NORMALIZED
  ]

  const config = configFactory(false, false, false, false)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(value).toBe(email(key, config))
  })
})

test('Anonymize username and domain', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED_FULL_HASH,
    EXTERNAL_EMAIL_NORMALIZED_FULL_HASH,
    INTERNAL_EMAIL_NORMALIZED_FULL_HASH,
    INTERNAL_EMAIL_NORMALIZED_FULL_HASH
  ]

  const config = configFactory(true, true, true, true)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(value).toBe(email(key, config))
  })
})

test('Anonymize username and domain with plus sign addressing enabled', () => {
  const results = [
    EXTERNAL_EMAIL_WITH_PLUS_SIGN_ADDRESSING_NORMALIZED_FULL_HASH,
    EXTERNAL_EMAIL_WITH_PLUS_SIGN_ADDRESSING_NORMALIZED_FULL_HASH,
    INTERNAL_EMAIL_WITH_PLUS_SIGN_ADDRESSING_NORMALIZED_FULL_HASH,
    INTERNAL_EMAIL_WITH_PLUS_SIGN_ADDRESSING_NORMALIZED_FULL_HASH
  ]

  const config = configFactory(true, true, true, true, true)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(value).toBe(email(key, config))
  })
})

test('Anonymize domain', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH,
    EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH,
    INTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH,
    INTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH
  ]

  const config = configFactory(false, true, false, true)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(value).toBe(email(key, config))
  })
})

test('Anonymize username', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED_USERNAME_HASH,
    EXTERNAL_EMAIL_NORMALIZED_USERNAME_HASH,
    INTERNAL_EMAIL_NORMALIZED_USERNAME_HASH,
    INTERNAL_EMAIL_NORMALIZED_USERNAME_HASH
  ]

  const config = configFactory(true, false, true, false)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(value).toBe(email(key, config))
  })
})

test('Anonymize external domain only', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH,
    EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH,
    INTERNAL_EMAIL_NORMALIZED,
    INTERNAL_EMAIL_NORMALIZED
  ]

  const config = configFactory(false, false, false, true, false, INTERNAL_DOMAINS)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(value).toBe(email(key, config))
  })
})
