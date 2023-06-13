import {
  jsonMapper,
  type Schema
} from '../../../mapper'
import { type MailFolder } from '../common/interfaces'
import { mailFolderSchema } from '../common/schema'

export const schema: Schema<MailFolder> = mailFolderSchema

export const getMailFolderMapper = jsonMapper<MailFolder>(schema)
