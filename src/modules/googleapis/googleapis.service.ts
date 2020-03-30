import { google } from 'googleapis'
import { Token } from './interfaces/token.interface'
import { matchPath } from '../../helpers/path.helper'
import { AuthorizationFactory } from '../../proxy/proxy-request'
import { scopes, privateKey, clientEmail } from './googleapis.config'
import tokenService from '../../token/token.service'

export const refreshAccessToken = async (userId: string): Promise<Token> => {
  const auth = new google.auth.GoogleAuth({
    scopes,
    credentials: {
      private_key: privateKey,
      client_email: clientEmail
    },
    clientOptions: { subject: userId }
  })

  const authClient = await auth.getClient()

  return new Promise((resolve, reject) => {
    authClient.refreshAccessToken((err) => {
      if (err) {
        console.error(err)
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


type PathExtractorMap = {
  [path: string]: (path: string) => string
}

type AuthorizationPathExtractorFactory = (pathExtractorMap: PathExtractorMap ) => AuthorizationFactory

export const authorizationPathExtractorFactory: AuthorizationPathExtractorFactory =(pathExtractorMap: PathExtractorMap) => async (path: string): Promise<string> => {
  const extractor = matchPath<(path: string) => string>(path, pathExtractorMap)

  if (!extractor) {
    return ''
  }

  const userId = extractor(path)

  let token = tokenService.getById(userId)

  const nowPlus10Minutes = Date.now() + 10 * 60 * 1000

  const shouldRefresh = !(token && token.expiresAt >= nowPlus10Minutes)

  if (shouldRefresh) {
    try {
      const result = await refreshAccessToken(userId)
      token = tokenService.update({
        id: userId,
        ...result
      })
    } catch (err) {
      return ''
    }
  }

  return `${token.type} ${token.token}`
}

export default {
  refreshAccessToken,
  authorizationPathExtractorFactory
}
