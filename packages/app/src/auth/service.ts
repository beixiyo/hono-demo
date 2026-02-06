import { sign } from 'hono/jwt'

export const JWT_SECRET = 'template-secret-key'

export const authService = {
  async generateToken(userId: string) {
    const payload = {
      sub: userId,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }
    return await sign(payload, JWT_SECRET, 'HS256')
  },
}
