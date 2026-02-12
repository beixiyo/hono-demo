import { join } from 'node:path'
import { Service } from '@/core/di'
import { FileServiceToken } from './tokens'

@Service(FileServiceToken)
export class FileService {
  async saveFile(file: File) {
    const buffer = await file.arrayBuffer()
    const filePath = join(import.meta.dirname, '..', '..', 'public', 'uploads', file.name)
    await Bun.write(filePath, buffer)

    return {
      name: file.name,
      url: `/public/uploads/${file.name}`,
    }
  }
}
