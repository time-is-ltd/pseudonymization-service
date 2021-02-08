import { toSnakeCase } from './to-snake-case.transformer'

export const toKebabCase = (s = '') => toSnakeCase(s).replace(/_/g, '-')
