import { jsonMapper, type Schema } from '../../../mapper'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StopSubscription {}

const schema: Schema<StopSubscription> = {}

export const stopSubscriptionMapper = jsonMapper<StopSubscription>(schema)
