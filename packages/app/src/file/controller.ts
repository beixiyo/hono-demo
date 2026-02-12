import type { UploadRouteContext, UploadRouteReturn } from './route'
import type { FileService } from './service'
import { Controller, Post } from '@/core/controller'
import { jsonFail, jsonOk } from '@/core/response'
import { Inject } from '../core/di'
import { uploadRoute } from './route'
import { FileServiceToken } from './tokens'

@Controller('/api/file')
export class FileController {
  constructor(
    @Inject(FileServiceToken) private readonly fileService: FileService,
  ) {}

  @Post(uploadRoute)
  async upload(c: UploadRouteContext): Promise<UploadRouteReturn> {
    const { file } = c.req.valid('form')

    if (file instanceof File) {
      const result = await this.fileService.saveFile(file)
      return jsonOk(c, {
        message: '文件上传成功',
        ...result,
      }) as UploadRouteReturn
    }

    return jsonFail(c, '未提供文件', 400) as UploadRouteReturn
  }
}
