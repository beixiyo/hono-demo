import { createRoute } from '@hono/zod-openapi'

export const sseRoute = createRoute({
  method: 'get',
  path: '/events',
  tags: ['实时通信'],
  summary: 'SSE 事件流接口',
  responses: {
    200: {
      description: 'SSE 流响应',
      content: {
        'text/event-stream': {
          schema: {
            type: 'string',
          },
        },
      },
    },
  },
})
