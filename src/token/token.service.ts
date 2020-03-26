import tokenRepository from './token.repository'
import { Token } from './interfaces/token.interface'

export class TokenService {
  create(token: Token) {
    return tokenRepository.create(token)
  }

  update(token: Token) {
    return tokenRepository.update(token)
  }

  getById(id: string) {
    return tokenRepository.getById(id)
  }

  isValid(token: Token, offset = 10 * 60 * 1000) {
    const nowPlusOffset = Date.now() + offset

    const isValid = token.expiresAt >= nowPlusOffset

    return isValid
  }
}

export default new TokenService()