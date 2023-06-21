import { jsonMapper } from '../../../mapper'
import { subscriptionSchema } from '../common/schema'
import { type Subscription } from '../common/interfaces'

export const listSubscriptionMapper = jsonMapper<Subscription>([subscriptionSchema])
