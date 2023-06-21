import { jsonMapper, type Schema, TYPES } from '../../../mapper'

interface Content {
  contentUri: string
  contentId: string
  contentType: string
  contentCreated: string
  contentExpiration: string
}

const schema: Schema<Content> = {
  contentUri: TYPES.String,
  contentId: TYPES.String,
  contentType: TYPES.String,
  contentCreated: TYPES.String,
  contentExpiration: TYPES.String
}

export const listContentMapper = jsonMapper<Content>([schema])
