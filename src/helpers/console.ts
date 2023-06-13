export const printHeader = (header: string, char = '-') => {
  console.log(char.repeat(header.length))
  console.log(header)
  console.log(char.repeat(header.length))
}
