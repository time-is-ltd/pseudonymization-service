import { jsonMapper, type Schema } from '../../../mapper'

export interface StopSubscription {}

const schema: Schema<StopSubscription> = {}

export const stopSubscriptionMapper = jsonMapper<StopSubscription>(schema)
