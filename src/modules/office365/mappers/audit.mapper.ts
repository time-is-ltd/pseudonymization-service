import { jsonMapper, type Schema, TYPES } from '../../../mapper'

interface AuditRecord {
  CreationTime: string
  Id: string
  Operation: string
  UserType: number
  UserId: string
  ObjectId: string
  ItemType: string
  SourceFileExtension: string
  UserSharedWith: string
  SharingType: string
  ListItemUniqueId: string
  TargetUserOrGroupType: string
  TargetUserOrGroupName: string
  EventData: string
  FileSizeBytes: number
}

const schema: Schema<AuditRecord> = {
  CreationTime: TYPES.String,
  Id: TYPES.String,
  Operation: TYPES.String,
  UserType: TYPES.Number,
  UserId: TYPES.Email,
  ObjectId: TYPES.Hashed,
  ItemType: TYPES.String,
  SourceFileExtension: TYPES.String,
  UserSharedWith: TYPES.Email,
  SharingType: TYPES.String,
  ListItemUniqueId: TYPES.String,
  TargetUserOrGroupType: TYPES.String,
  TargetUserOrGroupName: TYPES.EmailOrHashed,
  EventData: TYPES.String,
  FileSizeBytes: TYPES.Number
}

export const auditMapper = jsonMapper<AuditRecord>([schema])
