import { RequestHandler } from 'express'
import * as qs from 'querystring'
import request from '../../request'
import config from '../../config'
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

type TokenHandler = (options: TokenHandlerOptions, onAccessToken: (token: Token) => void) => RequestHandler[]

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

  const requestOptions = {
    method: 'post',
    data: qs.stringify(body)
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
      token: data[accessTokenName]
    },
    headers
  }
}

const tokenHandler: TokenHandler = (options: TokenHandlerOptions, onAccessToken) => [
  async (req, res, next) => {
    let body = ''
    req.on('data', (chunk) => body += chunk.toString())

    req.on('end', async () => {
      const parsedBody = qs.parse(body)
      // Compare refresh token with proxy api token
      if (config.apiToken !== parsedBody.refresh_token) {
        return res.sendStatus(403)
      }

      try {
        const response = await oauth2Request(options)
        const {
          status,
          statusText,
          data,
          headers
        } = response

        onAccessToken(data)

        const {
          accessTokenName,
          refreshTokenName
        } = getOptions(options)

        const expiresIn = data.expiresAt > 0
          ? (data.expiresAt - Date.now()) / 1000
          : 3600

        // Anonymize access and refresh token
        const responseData = {
          [accessTokenName]: config.apiToken,
          [refreshTokenName]: config.apiToken,
          expires_in: expiresIn,
          token_type: data.type
        }

        const stringifiedResponseData = JSON.stringify(responseData)
        const contentLength = Buffer.byteLength(stringifiedResponseData)

        headers['content-length'] = contentLength

        res.writeHead(status, statusText, headers)

        res.write(stringifiedResponseData)
        res.end()
      } catch (err) {
        console.log(err)
        next(err)
      }
    })
  }
]

export default tokenHandler
