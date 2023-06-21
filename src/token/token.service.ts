import tokenRepository from './token.repository'
import { type Token } from './interfaces/token.interface'

export class TokenService {
  create (token: Token): Token {
    return tokenRepository.create(token)
  }

  update (token: Token): Token {
    return tokenRepository.update(token)
  }

  getById (id: string): Token {
    return tokenRepository.getById(id)
  }

  isValid (token: Token, offset = 10 * 60 * 1000): boolean {
    const nowPlusOffset = Date.now() + offset

    const isValid = token.expiresAt >= nowPlusOffset

    return isValid
  }
}

export default new TokenService()
