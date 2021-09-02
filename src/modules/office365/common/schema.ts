import { Schema, TYPES } from '../../../mapper'
import { Subscription, Webhook } from './interfaces'

export const webhookSchema: Schema<Webhook> = {
  authId: TYPES.String,
  address: TYPES.String,
  expiration: TYPES.String,
  status: TYPES.String,
}

export const subscriptionSchema: Schema<Subscription> = {
  contentType: TYPES.String,
  status: TYPES.String,
  webhook: webhookSchema,
}