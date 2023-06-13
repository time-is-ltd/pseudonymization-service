import { type AnonymizeEmailConfig } from '../transformers'
import { ANONYMIZED_EMAIL, ANONYMIZED_FILENAME } from '../../helpers/testing'

export const email = (email: string, config?: AnonymizeEmailConfig): string => {
  return ANONYMIZED_EMAIL
}

export const contentType = (value: string): string => {
  return typeof value === 'string' ? String(value) : ''
}

export const extractDomains = (value: string): string => {
  return typeof value === 'string' ? 'extracted' : ''
}

export const id = (value: string): string => {
  return typeof value === 'string' ? String(value) : ''
}

export const url = (value: string): string => {
  return typeof value === 'string' ? String(value) : ''
}

export const filename = (filename = ''): string => {
  return ANONYMIZED_FILENAME
}

export const proxify = (maybeUrl = ''): string => {
  return typeof maybeUrl === 'string' ? String(maybeUrl) : ''
}

export const config = {
  internalDomainList: ['timeisltd.com'],
  extractDomains: true
}
