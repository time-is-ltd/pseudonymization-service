import { type Token } from './interfaces/token.interface'
const store: Record<string, Token> = {}

export class TokenRepository {
  create (token: Token): Token {
    store[token.id] = token
    return token
  }

  update (token: Token): Token {
    store[token.id] = token
    return token
  }

  getById (id: string): Token {
    return store[id]
  }
}

export default new TokenRepository()
