import { jsonMapper } from '../../../mapper'
import { type Subscription } from '../common/interfaces'
import { subscriptionSchema } from '../common/schema'

export const startSubscriptionMapper = jsonMapper<Subscription>(subscriptionSchema)
