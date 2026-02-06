import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { fileService } from './service'
import type { uploadRoute } from './route'
import { jsonFail, jsonOk } from '@/core/response'

export const fileController = {
  upload: (async (c) => {
    const { file } = c.req.valid('form')

    if (file instanceof File) {
      const result = await fileService.saveFile(file)
      return jsonOk(c, {
        message: '文件上传成功',
        ...result,
      })
    }

    return jsonFail(c, '未提供文件', 400)
  }) as RouteHandler<typeof uploadRoute, AppEnv>,
}
