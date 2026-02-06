import { describe, expect, test } from 'bun:test'
import { sign } from 'hono/jwt'
import { app } from '../index'
import { JWT_SECRET } from './service'

describe('认证模块功能测试', () => {
  // 1. JWT 功能测试
  test('JWT 流程测试: 登录并访问受保护接口', async () => {
    const loginRes = await app.request('/auth/jwt/login', {
      method: 'POST',
      headers: {
        Origin: 'http://localhost',
      },
    })
    const { token } = await loginRes.json()
    expect(token).toBeDefined()

    const protectedRes = await app.request('/auth/jwt/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(protectedRes.status).toBe(200)
    const data = await protectedRes.json()
    expect(data.message).toBe('通过 JWT 验证')
  })

  test('JWT 异常测试: 错误或缺失 token 应该返回 401', async () => {
    const res1 = await app.request('/auth/jwt/protected')
    expect(res1.status).toBe(401)

    const res2 = await app.request('/auth/jwt/protected', {
      headers: {
        Authorization: 'Bearer invalid-token',
        Origin: 'http://localhost',
      },
    })
    expect(res2.status).toBe(401)
  })

  test('JWT 过期测试: 过期的 token 应该返回 401', async () => {
    const payload = {
      sub: 'user123',
      exp: Math.floor(Date.now() / 1000) - 10, // 10秒前过期
    }
    const expiredToken = await sign(payload, JWT_SECRET, 'HS256')

    const res = await app.request('/auth/jwt/protected', {
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
    })
    expect(res.status).toBe(401)
  })
})
