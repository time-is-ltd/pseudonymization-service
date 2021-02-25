import { URL } from 'url'

export const proxify = (maybeUrl: string, baseUrl?: string): string => {
  if(!baseUrl) {
    return maybeUrl
  }

  if (!maybeUrl) {
    return maybeUrl
  }

  try {
    const { origin, hostname } = new URL(maybeUrl)
    return maybeUrl
      .replace(new RegExp(`^${origin}`), `${baseUrl.replace(/\/$/, '')}/${hostname}`)
  } catch (err) {
    return maybeUrl
  }
}
