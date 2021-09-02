export interface Webhook {
  authId: string
  address: string
  expiration: string
  status: string
}

export interface Subscription {
  contentType: string
  status: string
  webhook: Webhook
}

