import { AnonymizeEmailConfig } from '../transformers'
import { ANONYMIZED_EMAIL, ANONYMIZED_FILENAME } from '../../helpers/testing'

export const email = (email: string, config?: AnonymizeEmailConfig): string => {
  return ANONYMIZED_EMAIL
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

export default {
  email,
  filename
}