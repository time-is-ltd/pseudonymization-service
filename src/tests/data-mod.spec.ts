import { schema as o365_list_user_calendars_schema } from '../modules/microsoftgraph/mappers/list-user-calendars.mapper'
import { schema as o365_list_user_events_schema } from '../modules/microsoftgraph/mappers/list-user-events.mapper'
import { schema as o365_list_user_messages_schema } from '../modules/microsoftgraph/mappers/list-user-messages.mapper'
import { schema as o365_list_mail_folders_schema } from '../modules/microsoftgraph/mappers/list-mail-folders.mapper'
import { schema as o365_get_user_id_schema } from '../modules/microsoftgraph/mappers/get-user-id.mapper'
import { schema as o365_get_mail_folder_schema } from '../modules/microsoftgraph/mappers/get-mail-folder.mapper'
import { schema as o365_list_communications_call_records_schema } from '../modules/microsoftgraph/mappers/list-comunications-call-records.mapper'
import { schema as o365_list_communications_call_records_sessions_schema } from '../modules/microsoftgraph/mappers/list-comunications-call-records-sessions.mapper'
import * as yaml from 'js-yaml'
import { TYPES } from '../mapper'

beforeEach(() => {
  global.console = require('console')
})

function process (key, value) {
  if (Array.isArray(value)) {
    if (value.includes(TYPES.Private)) {
      value = TYPES.Private
    } else if (value.includes(TYPES.Url)) {
      value = TYPES.Url
    } else {
      value = value[0]
    }
  }

  switch (value) {
    case TYPES.Private:
      return 'removed'
    case TYPES.Id:
      return 'pseudonymized *'
    case TYPES.Email:
      return 'pseudonymized *'
    case TYPES.Url:
      return 'pseudonymized *'
    case TYPES.Filename:
      return 'derived (file extension type only)'
    case TYPES.ContentType:
      return 'derived (file content type only) *'
    case TYPES.ExtractedDomains:
      return 'derived (extracted domains only) *'
    case TYPES.String:
    case TYPES.Array:
    case TYPES.Boolean:
    case TYPES.Datetime:
    case TYPES.ETag:
    case TYPES.Username:
    case TYPES.Number:
      return '✓'
    default:
      throw new Error('Unexpected value ' + value.toString())
  }
}

function traverse (o, desc, func) {
  for (let i in o) {
    if (typeof (o[i]) == 'symbol') {
      desc[i] = process(i, o[i])
    } else if (Array.isArray(o[i])) {
      const all_symbols = o[i].every((val, i, arr) => typeof (val) == 'symbol')
      if (all_symbols) {
        desc[i] = process(i, o[i])
      } else {
        desc[i] = []
        for (let j in o[i]) {
          desc[i][j] = {}
          traverse(o[i][j], desc[i][j], func)
        }
      }
    } else if (typeof (o[i]) == 'object') {
      desc[i] = {}
      traverse(o[i], desc[i], func)
    } else {
      desc[i] = o[i]
    }
  }
}

function dump_data_mod (schema) {
  const desc = {}
  traverse(schema, desc, process)
  const out = yaml.dump(desc)
  console.log(out)
}

test('data mod - o365 list user calendars', async () => {
  dump_data_mod(o365_list_user_calendars_schema)
})

test('data mod - o365 list user events', async () => {
  dump_data_mod(o365_list_user_events_schema)
})

test('data mod - o365 list user messages', async () => {
  dump_data_mod(o365_list_user_messages_schema)
})

test('data mod - o365 list mail folders', async () => {
  dump_data_mod(o365_list_mail_folders_schema)
})

test('data mod - o365 get user id', async () => {
  dump_data_mod(o365_get_user_id_schema)
})

test('data mod - o365 get mail folder', async () => {
  dump_data_mod(o365_get_mail_folder_schema)
})

test('data mod - o365 list communications call records', async () => {
  dump_data_mod(o365_list_communications_call_records_schema)
})

test('data mod - o365 list communications call records sessions', async () => {
  dump_data_mod(o365_list_communications_call_records_sessions_schema)
})
