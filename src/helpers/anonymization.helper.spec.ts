import {
  email,
  filename,
  AnonymizeEmailConfig
} from './anonymization.helper'

const configFactory = (internalUsername: boolean, internalDomain: boolean, externalUsername: boolean, externalDomain: boolean, internalDomainList: string[] = []): AnonymizeEmailConfig => {
  return  {
    anonymizeInternalEmailUsername: internalUsername,
    anonymizeExternalEmailUsername: externalUsername,
    anonymizeInternalEmailDomain: internalDomain,
    anonymizeExternalEmailDomain: externalDomain,
    internalDomainList,
    anonymizationSalt: 'test'
  }
}

const EXTERNAL_EMAIL = 'tesT @ gmail.com'
const EXTERNAL_EMAIL_NORMALIZED = 'test@gmail.com'
const EXTERNAL_EMAIL_NORMALIZED_FULL_HASH = '125d6d03b32c84d4@c813bbe57db2f770.hash'
const EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH = 'test@c813bbe57db2f770.hash'
const EXTERNAL_EMAIL_NORMALIZED_USERNAME_HASH = '125d6d03b32c84d4@gmail.com'

const INTERNAL_DOMAINS = ['domain.com', 'anotherdomain.eu']
const INTERNAL_DOMAIN_EMAIL = 'TeSt@DomAin .Com'
const INTERNAL_DOMAIN_EMAIL_NORMALIZED = 'test@domain.com'
const INTERNAL_DOMAIN_EMAIL_NORMALIZED_FULL_HASH = '125d6d03b32c84d4@38d33d5e968778af.hash'
const INTERNAL_DOMAIN_EMAIL_NORMALIZED_DOMAIN_HASH = 'test@38d33d5e968778af.hash'
const INTERNAL_DOMAIN_EMAIL_NORMALIZED_USERNAME_HASH = '125d6d03b32c84d4@domain.com'

const emails = [
  EXTERNAL_EMAIL,
  EXTERNAL_EMAIL_NORMALIZED,
  INTERNAL_DOMAIN_EMAIL,
  INTERNAL_DOMAIN_EMAIL_NORMALIZED
]

test('Do not anonymize username and domain', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED,
    EXTERNAL_EMAIL_NORMALIZED,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED
  ]

  const config = configFactory(false, false, false, false)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(email(key, config)).toBe(value)
  })
})

test('Anonymize username and domain', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED_FULL_HASH,
    EXTERNAL_EMAIL_NORMALIZED_FULL_HASH,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED_FULL_HASH,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED_FULL_HASH
  ]

  const config = configFactory(true, true, true, true)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(email(key, config)).toBe(value)
  })
})

test('Anonymize domain', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH,
    EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED_DOMAIN_HASH,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED_DOMAIN_HASH
  ]

  const config = configFactory(false, true, false, true)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(email(key, config)).toBe(value)
  })
})

test('Anonymize username', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED_USERNAME_HASH,
    EXTERNAL_EMAIL_NORMALIZED_USERNAME_HASH,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED_USERNAME_HASH,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED_USERNAME_HASH
  ]

  const config = configFactory(true, false, true, false)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(email(key, config)).toBe(value)
  })
})

test('Anonymize external domain only', () => {
  const results = [
    EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH,
    EXTERNAL_EMAIL_NORMALIZED_DOMAIN_HASH,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED,
    INTERNAL_DOMAIN_EMAIL_NORMALIZED
  ]

  const config = configFactory(false, false, false, true, INTERNAL_DOMAINS)

  emails.forEach((key: string, index: number) => {
    const value = results[index]
    expect(email(key, config)).toBe(value)
  })
})


test('Anonymize filename', () => {
  const filenames = [
    'test.jpg',
    '.env',
    ` Asd "' _*a&23MJSkwe.png`,
    'some.tar.gz',
    'noextension'
  ]
  const results = [
    'xxxx.jpg',
    '.env',
    'xxxxxxxxxxxxxxxxxxxx.png',
    'xxxxxxxx.gz',
    'xxxxxxxxxxx'
  ]

  filenames.forEach((key: string, index: number) => {
    const value = results[index]
    expect(filename(key)).toBe(value)
  })
})
