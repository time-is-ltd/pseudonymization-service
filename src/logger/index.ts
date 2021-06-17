import { prettify } from './helpers'

export const VERBOSITY = parseInt(process.env.VERBOSITY ?? '0', 10)
type Level = 'info' | 'log' | 'error' | 'warn' | 'verbose' | 'debug'

export const logger = (level: Level, ...messages: unknown[]) => {
  switch (level) {
    case 'info':
    case 'warn':
    case 'error':
    case 'log':
      console[level](...prettify(messages))
      return
    case 'debug':
      if (VERBOSITY > 0) {
        console.debug(...prettify(messages))
      }
      return
    case 'verbose':
      if (VERBOSITY > 1) {
        console.debug(...prettify(messages))
      }
      return
  }
}
