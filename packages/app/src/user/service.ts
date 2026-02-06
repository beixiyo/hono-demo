import type { User } from './schema'

export const userService = {
  async getUserById(id: string): Promise<User> {
    // 模拟 DB 查询
    return {
      id,
      name: 'Ultra-man',
      age: 20,
    }
  },
}
