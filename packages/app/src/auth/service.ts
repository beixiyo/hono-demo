import { sign } from 'hono/jwt'
import { AUTH_CONFIG, JWT_CONFIG } from '@/core/constants'

export const authService = {
  async generateToken(userId: string) {
    return await sign(
      {
        sub: userId,
        role: AUTH_CONFIG.defaultUserRole,
        exp: Math.floor(Date.now() / 1000) + JWT_CONFIG.expSeconds,
      },
      JWT_CONFIG.secret,
      'HS256'
    )
  },
}
