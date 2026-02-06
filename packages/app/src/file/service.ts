export const fileService = {
  async saveFile(file: File) {
    const buffer = await file.arrayBuffer()
    const filePath = `public/uploads/${file.name}`
    await Bun.write(filePath, buffer)
    return {
      name: file.name,
      url: `/public/uploads/${file.name}`,
    }
  },
}
