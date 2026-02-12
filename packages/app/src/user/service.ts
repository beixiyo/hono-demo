import type { User } from './schema'
import { Service } from '@/core/di'
import { UserServiceToken } from './tokens'

@Service(UserServiceToken)
export class UserService {
  async getUserById(id: string): Promise<User> {
    return {
      id,
      name: 'Ultra-man',
      age: 20,
    }
  }
}
