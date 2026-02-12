import { createRoute } from '@hono/zod-openapi'
import { createErrorSchema, createSuccessSchema } from '../core/response'
import { FileUploadSchema, UploadResponseSchema } from './schema'

export const uploadRoute = createRoute({
  method: 'post',
  path: '/upload',
  tags: ['文件操作'],
  summary: '文件上传',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: FileUploadSchema,
        },
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: createSuccessSchema(UploadResponseSchema) } }, description: '上传成功' },
    400: { content: { 'application/json': { schema: createErrorSchema() } }, description: '参数错误' },
  },
})
