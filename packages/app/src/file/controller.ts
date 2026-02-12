import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { fileService } from './service'
import { uploadRoute } from './route'
import { jsonFail, jsonOk } from '@/core/response'
import { Controller, Post } from '@/core/controller'

@Controller('/api/file')
export class FileController {
  @Post(uploadRoute)
  async upload(c: Parameters<RouteHandler<typeof uploadRoute, AppEnv>>[0]): Promise<ReturnType<RouteHandler<typeof uploadRoute, AppEnv>>> {
    const { file } = c.req.valid('form')

    if (file instanceof File) {
      const result = await fileService.saveFile(file)
      return jsonOk(c, {
        message: '文件上传成功',
        ...result,
      }) as ReturnType<RouteHandler<typeof uploadRoute, AppEnv>>
    }

    return jsonFail(c, '未提供文件', 400) as ReturnType<RouteHandler<typeof uploadRoute, AppEnv>>
  }
}
