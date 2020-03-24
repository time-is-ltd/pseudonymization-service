import { Token } from './interfaces/token.interface'
let store: {
  [key: string]: Token
} = {}

export class TokenRepository {
  create(token: Token) {
    store[token.id] = token
    return token
  }

  update(token: Token) {
    store[token.id] = token
    return token
  }

  getById(id: string) {
    return store[id]
  }
}

export default new TokenRepository()
