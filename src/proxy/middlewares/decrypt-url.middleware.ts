import { RequestHandler } from '../interfaces'
import config from '../../app.config'
import { RequestError } from '../../request'
import { decryptUrl } from '../../anonymizer'

export const decryptUrlMiddleware = (): RequestHandler => async ({ url, ...rest }) => {
  try {
    const rsaPrivateKey = await config.rsaPrivateKey
    const decryptedUrl = decryptUrl(url, rsaPrivateKey)

    return { ...rest, url: decryptedUrl }
  } catch (err) {
    throw new RequestError(400, undefined, JSON.stringify({ error: 'Error in RSA' }))
  }
}
