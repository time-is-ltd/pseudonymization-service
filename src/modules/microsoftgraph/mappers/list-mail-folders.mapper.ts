import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../mapper'
import { MailFolder } from '../common/interfaces'
import { mailFolderSchema } from '../common/schema'

export interface MailFolders {
  '@odata.context': string
  value: MailFolder[]
}

const schema: Schema<MailFolders> = {
  '@odata.context': [
    TYPES.Private,
    TYPES.String
  ],
  value: [
    mailFolderSchema
  ]
}

export const listMailFoldersMapper = jsonMapper<typeof schema, MailFolders>(schema)
