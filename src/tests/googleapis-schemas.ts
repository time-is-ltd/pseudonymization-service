/**
 * Schemas for anonymized content from google API.
 */

export const listUserMessagesSchema = {
  type: 'object',
  properties: {
    messages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          threadId: { type: 'string' }
        },
        required: ['id', 'threadId'],
        additionalProperties: false
      },
    }
  },
  required: ['messages'],
}

export const getUserMessageSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    threadId: { type: 'string' },
    labelIds: {
      type: 'array',
      items: { type: 'string' }
    },
    snippet: { type: 'string' },
    historyId: { type: 'string' },
    internalDate: { type: 'string' },
    payload: { '$ref': '#/definitions/payload' },
  },
  required: ['id', 'threadId', 'labelIds', 'snippet', 'internalDate', 'payload'],
  definitions: {
    payload: {
      type: 'object',
      properties: {
        partId: { type: 'string' },
        mimeType: { type: 'string' },
        filename: { type: 'string' },
        headers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              value: { type: 'string' }
            }
          }
        },
        body: {
          type: 'object',
          properties: {
            size: { type: 'integer' },
            data: { type: 'string', maxLength: 0 }
          },
          additionalProperties: false
        },
        parts: {
          type: 'array',
          items: { '$ref': '#/definitions/payload' }
        }
      },
      required: ['partId', 'mimeType', 'filename', 'headers', 'body'],
    },
    siteEstimate: { type: 'integer' }
  }
}

export const listUserCalendarsSchema = {
  type: 'object',
  properties: {
    kind: { type: 'string' },
    etag: { type: 'string' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          kind: { type: 'string' },
          etag: { type: 'string' },
          summary: { type: 'string', maxLength: 0 },
          timeZone: { type: 'string' },
          colorId: { type: 'string' },
          backgroundColor: { type: 'string' },
          foregroundColor: { type: 'string' },
          selected: { type: 'boolean' },
          accessRole: { type: 'string' },
          defaultReminders: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                method: { type: 'string' }
              }
            }
          },
          notificationSettings: {
            type: 'object',
            properties: {
              notifications: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    method: { type: 'string' }
                  }
                }
              }
            }
          },
          primary: { type: 'boolean' },
          conferenceProperties: {
            type: 'object',
            properties: {
              allowedConferenceSolutionTypes: {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            }
          }
        },
        required: ['id', 'kind', 'etag', 'summary', 'timeZone', 'selected', 'accessRole', 'defaultReminders',
          'conferenceProperties']
      }
    }
  },
  required: ['kind', 'etag', 'items',]
}

export const listCalendarEventsSchema = {
  type: 'object',
  properties: {
    kind: { type: 'string' },
    etag: { type: 'string' },
    summary: { type: 'string', maxLength: 0 },
    updated: { type: 'string' },
    timeZone: { type: 'string' },
    accessRole: { type: 'string' },
    defaultReminders: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          method: { type: 'string' }
        }
      }
    },
    nextSyncToken: { type: 'string' },
  },
  required: ['kind', 'etag', 'summary', 'updated', 'timeZone', 'accessRole', 'defaultReminders', 'nextSyncToken',]
}
