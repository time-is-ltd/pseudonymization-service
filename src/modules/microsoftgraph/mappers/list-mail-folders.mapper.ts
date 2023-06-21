import {
  jsonMapper,
  TYPES,
  type Schema
} from '../../../mapper'
import { type MailFolder } from '../common/interfaces'
import { mailFolderSchema } from '../common/schema'

export interface MailFolders {
  '@odata.context': string
  value: MailFolder[]
}

export const schema: Schema<MailFolders> = {
  '@odata.context': [
    TYPES.Private,
    TYPES.String
  ],
  value: [
    mailFolderSchema
  ]
}

export const listMailFoldersMapper = jsonMapper<MailFolders>(schema)
