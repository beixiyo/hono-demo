import { sign } from 'hono/jwt'

const JWT_SECRET = process.env.JWT_SECRET || 'hono-demo-secret-change-in-production'

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
