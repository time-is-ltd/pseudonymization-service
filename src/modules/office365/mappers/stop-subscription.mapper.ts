import { jsonMapper, Schema } from '../../../mapper'

export interface StopSubscription {}

const schema: Schema<StopSubscription> = {}

export const stopSubscriptionMapper = jsonMapper<typeof schema, StopSubscription>(schema)
