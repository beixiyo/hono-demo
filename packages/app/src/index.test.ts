import { describe, expect, test } from 'bun:test'
import { sign } from 'hono/jwt'
import { app } from './index'

const JWT_SECRET = process.env.JWT_SECRET || 'hono-demo-secret-change-in-production'

describe('应用全局功能测试', () => {
  // 1. 静态资源测试
  test('应该能访问静态文件', async () => {
    const res = await app.request('/public/hello.txt')
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('Hello from public')
  })

  // 2. OpenAPI 业务路由测试
  test('应该能访问 User 业务路由', async () => {
    const token = await sign({ sub: 'user123', exp: Math.floor(Date.now() / 1000) + 60 }, JWT_SECRET, 'HS256')
    const res = await app.request('/api/users/123', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data.id).toBe('123')
    expect(data.data.name).toBe('Ultra-man')
  })

  test('未登录访问受保护路由应返回 401', async () => {
    const res = await app.request('/api/users/123')
    expect(res.status).toBe(401)
  })
})
