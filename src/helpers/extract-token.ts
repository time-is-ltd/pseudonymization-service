export default (str: string) => {
  // Replace Bearer from the beginning
  return str.replace(/^(\w+\s{0,})/, '')
}
