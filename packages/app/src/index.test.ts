import { describe, expect, test } from 'bun:test'
import { app } from './index'

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
    const res = await app.request('/users/123')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.id).toBe('123')
    expect(data.name).toBe('Ultra-man')
  })

  // 3. 文档接口测试
  test('应该能访问 API 文档', async () => {
    const res = await app.request('/doc')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.info.title).toBe('模板项目 API')
  })
})
