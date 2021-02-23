import * as qs from 'querystring'
import request from '../../request'
import { Token } from '../../token/interfaces/token.interface'

type TokenHandlerExtraDict = { [key: string]: string | number }
type TokenHandlerOptions = {
  url: string,
  clientId: string,
  clientSecret: string,
  grantType?: 'client_credentials',
  refreshToken?: string,
  accessTokenFieldName?: string,
  refreshTokenFieldName?: string,
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
  status: number,
  statusText: string,
  data: Token,
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

  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType,
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
