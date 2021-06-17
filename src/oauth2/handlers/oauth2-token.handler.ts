import * as qs from 'querystring'
import request from '../../request'
import { Token } from '../../token/interfaces/token.interface'

interface TokenHandlerExtraDict { [key: string]: string | number }
export interface TokenHandlerOptions {
  url: string
  clientId: string
  clientSecret?: string
  grantType?: 'client_credentials' | 'refresh_token'
  refreshToken?: string
  accessTokenFieldName?: string
  refreshTokenFieldName?: string
  extra?: TokenHandlerExtraDict
}

const getOptions = (options: TokenHandlerOptions) => {
  const {
    url,
    clientId,
    clientSecret,
    refreshToken,
    grantType = 'client_credentials',
    extra = {},
    accessTokenFieldName: accessTokenName = 'access_token',
    refreshTokenFieldName: refreshTokenName = 'refresh_token'
  } = options

  return {
    url,
    clientId,
    clientSecret,
    refreshToken,
    grantType,
    extra,
    accessTokenName,
    refreshTokenName
  }
}

export const oauth2Request = async (options: TokenHandlerOptions): Promise<{
  status: number
  statusText: string
  data: Token
  headers: any
}> => {
  const {
    url,
    clientId,
    clientSecret,
    refreshToken,
    grantType,
    extra,
    accessTokenName,
    refreshTokenName
  } = getOptions(options)

  const refreshTokenObj = refreshToken
    ? { [refreshTokenName]: refreshToken }
    : {}

  const clientSecretObj = clientSecret
    ? { client_secret: clientSecret }
    : {}

  const body = {
    client_id: clientId,
    grant_type: grantType,
    ...clientSecretObj,
    ...refreshTokenObj,
    ...extra
  }

  const urlEncodedBody = qs.stringify(body)
  const requestOptions = {
    method: 'post',
    headers: {
      'Content-Length': Buffer.byteLength(urlEncodedBody),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: urlEncodedBody
  }

  const response = await request(url, requestOptions)
  const {
    statusCode,
    statusMessage,
    data,
    headers
  } = response

  const json = JSON.parse(data)

  const expiresAt = Date.now() + json.expires_in * 1000
  return {
    status: statusCode,
    statusText: statusMessage,
    data: {
      type: json.token_type,
      expiresAt: expiresAt,
      token: json[accessTokenName]
    },
    headers
  }
}
