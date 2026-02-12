import type { User } from './schema'
import type { PgDb } from '@/db/client'
import { eq } from 'drizzle-orm'
import { Inject, Service } from '@/core/di'
import { PgDbToken } from '@/db/client'
import { users } from '@/db/schema'
import { UserServiceToken } from './tokens'

@Service(UserServiceToken)
export class UserService {
  constructor(
    /** users 表使用 `pgTable` 定义，因此这里显式依赖 PostgreSQL 版本 Db */
    @Inject(PgDbToken) private readonly db: PgDb,
  ) {}

  async getUserById(id: string): Promise<User> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    const record = rows[0]

    if (!record) {
      return {
        id,
        name: 'Ultra-man',
        age: 20,
      }
    }

    return {
      id: record.id,
      name: record.name,
      age: record.age,
    }
  }
}
