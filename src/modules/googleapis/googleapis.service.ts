import { google } from 'googleapis'
import { GaxiosError } from 'gaxios'
import config from './googleapis.config'
import { Token } from './interfaces/token.interface'
import { findTemplateAndMatch, AuthorizationFactory } from '../../proxy'
import { RequestError } from '../../request'
import tokenService from '../../token/token.service'

export const refreshAccessToken = async (userId: string): Promise<Token> => {
  const [clientEmail, privateKey, scopes, adminEmail] = await Promise.all([config.clientEmail, config.privateKey, config.scopes, config.adminEmail])

  const auth = new google.auth.GoogleAuth({
    scopes,
    credentials: {
      private_key: privateKey,
      client_email: clientEmail,
    },
    clientOptions: { subject: userId || adminEmail }
  })

  const authClient = await auth.getClient()

  return new Promise((resolve, reject) => {
    authClient.refreshAccessToken((err) => {
      if (err) {
        reject(err)
      }
    })
    authClient.once('tokens', (result) => {
      resolve({
        token: result.access_token || '',
        type: result.token_type || '',
        expiresAt: result.expiry_date || 0
      })
    })
  })
}

const getBearerAuthorization = (token: Token): string => `${token.type} ${token.token}`

export const authorizationPathExtractorFactory = (templates: string[]): AuthorizationFactory => async (path: string): Promise<string> => {
  const result = findTemplateAndMatch<{ userId: string }>(templates)(path)

  const { params: { userId = '' } } = result
  const decodedUserId = decodeURIComponent(userId)

  const token = tokenService.getById(decodedUserId)

  const nowPlus10Minutes = Date.now() + 10 * 60 * 1000

  const shouldRefresh = !(token && token.expiresAt >= nowPlus10Minutes)
  if (shouldRefresh) {
    try {
      const result = await refreshAccessToken(decodedUserId)
      const updatedToken = tokenService.update({
        id: decodedUserId,
        ...result
      })
      return getBearerAuthorization(updatedToken)
    } catch (err) {
      if (err instanceof GaxiosError) {
        if (err.response) {
          const { status, statusText } = err.response
          if (status >= 400 && status < 500) {
            throw new RequestError(403, undefined, err.response)
          }
          throw new RequestError(status, statusText, err.response)
        }
      }
      throw err
    }
  }

  return getBearerAuthorization(token)
}

export default {
  refreshAccessToken,
  authorizationPathExtractorFactory
}
