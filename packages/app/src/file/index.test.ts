import { describe, expect, test } from 'bun:test'
import { app } from '../index'

describe('文件模块功能测试', () => {
  test('文件上传功能测试', async () => {
    const formData = new FormData()
    const file = new File(['test content'], 'test-upload.txt', { type: 'text/plain' })
    formData.append('file', file)

    const res = await app.request('/file/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Origin: 'http://localhost',
      },
    })

    expect(res.status).toBe(200)
    const data = await res.status === 200
      ? await res.json()
      : {}
    expect(data.message).toBe('文件上传成功')
    expect(data.url).toBe('/public/uploads/test-upload.txt')
  })
})
