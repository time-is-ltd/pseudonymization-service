import { jsonMapper } from '../../../mapper'
import { Subscription } from '../common/interfaces'
import { subscriptionSchema } from '../common/schema'

export const startSubscriptionMapper = jsonMapper<typeof subscriptionSchema, Subscription>(subscriptionSchema)
