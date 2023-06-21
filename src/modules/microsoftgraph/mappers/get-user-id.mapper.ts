import {
  jsonMapper,
  TYPES,
  type Schema
} from '../../../mapper'

export interface User {
  '@odata.context': string
  id: string
  displayName: string
  givenName: string
  jobTitle: string
  mail: string
  mobilePhone: string
  officeLocation: string
  preferredLanguage: string
  surname: string
  userPrincipalName: string
}

export const schema: Schema<User> = {
  '@odata.context': [
    TYPES.Private,
    TYPES.String
  ],
  id: TYPES.String,
  displayName: [
    TYPES.Private,
    TYPES.String
  ],
  givenName: [
    TYPES.Private,
    TYPES.String
  ],
  jobTitle: [
    TYPES.Private,
    TYPES.String
  ],
  mail: TYPES.Email,
  mobilePhone: [
    TYPES.Private,
    TYPES.String
  ],
  officeLocation: [
    TYPES.Private,
    TYPES.String
  ],
  preferredLanguage: TYPES.String,
  surname: [
    TYPES.Private,
    TYPES.String
  ],
  userPrincipalName: TYPES.Email
}

export const getUserIdMapper = jsonMapper<User>(schema)
