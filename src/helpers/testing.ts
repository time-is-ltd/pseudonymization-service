export const ANONYMIZED_EMAIL = 'anonymizedusername@anonymizeddomain.hash'
export const ANONYMIZED_FILENAME = 'x.extension'

const people = {
  1: {
    name: 'John Doe', 
    address: 'john.doe@gmail.com'
  },
  2: {
    name: 'John Doe',
    address: 'john.doe@gmail.com'
  },
  3: {
    name: 'Jane Doe', 
    address: 'jane.doe@domain.com'
  },
  4: {
    name: 'Richard Roe',
    address: 'richard.roe@email.com'
  },
  5: {
    name: 'John Smith',
    address: 'john.smith@example.com'
  },
  6: {
    name: 'John Smith II',
    address: 'john.smith.ii@example.com'
  },
  7: {
    name: 'Jane Doe II',
    address: 'jane.doe.ii@domain.com'
  }
}

export type PersonId = keyof typeof people

export const getEmail = (id: PersonId) => {
  const person = people[id]
  return {
    ...person,
    toString: () => `<${person.name}> ${person.address}`
  }
}

export const getAnonymizedEmail = (id: PersonId) => {
  return {
    name: '',
    address: ANONYMIZED_EMAIL,
    toString: () => ANONYMIZED_EMAIL
  }
}

export const mapperEquals = async (mapper: (obj: any) => Promise<string>, inputObj: any, resultObj: any) => {
  const inputStr = JSON.stringify(inputObj)
  const output = await mapper(inputStr)
  const parsedOutput = JSON.parse(output)
  expect(parsedOutput).toEqual(resultObj)
}

export const testMapper = (
  name: string,
  mapper: (input?: string) => any,
  buildInput: (iterations?: number) => any,
  buildOutput: (iterations?: number) => any,
  empty: any = {}
) => {
  test(`${name} - Falsy request`, async () => {
    expect(JSON.parse(await mapper())).toEqual(empty)
    expect(JSON.parse(await mapper(null))).toEqual(empty)
    expect(JSON.parse(await mapper(undefined))).toEqual(empty)
    expect(JSON.parse(await mapper(JSON.stringify({ test: 'test' })))).toEqual(empty)
  })
  
  test(`${name} - no iterations`, async () => {
    const input = buildInput()
    const output = buildOutput()
    await mapperEquals(mapper, input, output)
  })

  for (let i = 1; i < 10; i++) {
    test(`${name} - ${i} iterations`, async () => {
      const input = buildInput(i)
      const output = buildOutput(i)
      await mapperEquals(mapper, input, output)
    })
  }
}
