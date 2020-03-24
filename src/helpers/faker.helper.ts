import * as faker from 'faker'

export const word = () => faker.random.word()
export const uuid = () => faker.random.uuid()
export const url = () => faker.internet.url()
export const name = () => faker.name.findName()
export const text = () => faker.lorem.text()
export const date = () => faker.date.past()
export const mimeType = () => faker.system.mimeType()
export const number = (max?: number) => faker.random.number(max)
export const boolean = () => faker.random.boolean()
export const email = () => faker.internet.email()
export const fileName = () => faker.system.fileName()
