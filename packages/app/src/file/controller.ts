import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { fileService } from './service'
import type { uploadRoute } from './route'

export const fileController = {
  upload: (async (c) => {
    const { file } = c.req.valid('form')

    if (file instanceof File) {
      const result = await fileService.saveFile(file)
      return c.json({
        message: '文件上传成功',
        ...result,
      }, 200)
    }

    return c.json({ message: '未提供文件' } as any, 400)
  }) as RouteHandler<typeof uploadRoute, AppEnv>,
}
