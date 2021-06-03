import { hash } from '../helpers'

export const hashed = (value: string, anonymizationSalt: string) => `${hash(value, anonymizationSalt)}.hash`
