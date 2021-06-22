export enum VerboseLevel {
  NORMAL,
  V,
  VV
}

export const verboseLevel = parseInt(process.env.VERBOSITY ?? '0', 10) as VerboseLevel

export const logger = (reqLevel: VerboseLevel, ...messages: unknown[]) => {
  if (reqLevel <= verboseLevel) {
    console.debug(...messages)
  }
}
