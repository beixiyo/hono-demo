import type { User } from './schema'
import { UserServiceToken } from './tokens'
import { Service } from '@/core/di'

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
