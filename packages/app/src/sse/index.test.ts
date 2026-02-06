import { describe, expect, it } from 'bun:test'
import { app } from '../index'

describe('SSE Module', () => {
  it('should return 200 and event-stream content type', async () => {
    const res = await app.request('/sse/events')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/event-stream')
    
    // 读取第一条数据验证
    const reader = res.body?.getReader()
    if (reader) {
      const { value } = await reader.read()
      const text = new TextDecoder().decode(value)
      expect(text).toContain('event: time-update')
      reader.releaseLock()
    }
  })
})
