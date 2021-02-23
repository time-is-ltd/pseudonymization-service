import { RequestHandler } from '../interfaces'
import config from '../../app.config'
import { RequestError } from '../../request'
import { decryptUrl } from '../../helpers/anonymization.helper'

export const decryptUrlMiddleware = (): RequestHandler => async ({ url, ...rest }) => {
  let decryptedUrl = url
  try {
    const rsaPrivateKey = await config.rsaPrivateKey
    decryptedUrl = decryptUrl(url, rsaPrivateKey)
  } catch (err) {
    throw new RequestError(400, undefined, JSON.stringify({ error: 'Error in RSA' }))
  }

  return { ...rest, url: decryptedUrl }
}
