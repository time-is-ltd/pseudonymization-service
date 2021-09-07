import {
  jsonMapper,
  TYPES,
  Schema
} from '../../../mapper'
import { MailFolder } from '../common/interfaces'
import { mailFolderSchema } from '../common/schema'

export const schema: Schema<MailFolder> = mailFolderSchema

export const getMailFolderMapper = jsonMapper<typeof schema, MailFolder>(schema)
