import { RequestHandler } from '../interfaces'
import { pathToAbsUrl } from '../../helpers/path.helper'

export const transformUrlMiddleware = (urlTransform: (url: string) => string): RequestHandler => async ({ url, ...rest }) => {
  const path = urlTransform(url)
  const absoluteUrl = pathToAbsUrl(path)

  return { ...rest, url: absoluteUrl }
}
