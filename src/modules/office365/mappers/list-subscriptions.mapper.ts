import { jsonMapper } from '../../../mapper'
import { subscriptionSchema } from '../common/schema'
import { Subscription } from '../common/interfaces'

export const listSubscriptionMapper = jsonMapper<typeof subscriptionSchema[], Subscription>([subscriptionSchema])
