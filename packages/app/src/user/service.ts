import type { User } from './schema'
import type { PgDb } from '@/db/client'
import { desc, eq } from 'drizzle-orm'
import { Inject, Service } from '@/core/di'
import { PgDbToken } from '@/db/client'
import { posts, users } from '@/db/schema'
import { UserServiceToken } from './tokens'

@Service(UserServiceToken)
export class UserService {
  constructor(
    @Inject(PgDbToken) private readonly db: PgDb,
  ) {}

  // ---------- Read ----------

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

  /** 分页列表（带排序） */
  async listUsers(input: ListUsersInput = {}): Promise<User[]> {
    const { limit = 10, offset = 0 } = input
    const rows = await this.db
      .select()
      .from(users)
      .orderBy(desc(users.id))
      .limit(limit)
      .offset(offset)

    return rows.map(r => ({
      id: r.id,
      name: r.name,
      age: r.age,
    }))
  }

  // ---------- Create ----------

  async createUser(input: CreateUserInput): Promise<User> {
    const [row] = await this.db
      .insert(users)
      .values({
        id: input.id,
        name: input.name,
        age: input.age,
      })
      .returning()

    if (!row)
      throw new Error('createUser: no row returned')
    return { id: row.id, name: row.name, age: row.age }
  }

  // ---------- Update ----------

  async updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
    const [row] = await this.db
      .update(users)
      .set({
        ...(input.name != null && { name: input.name }),
        ...(input.age != null && { age: input.age }),
      })
      .where(eq(users.id, id))
      .returning()

    if (!row)
      return null
    return { id: row.id, name: row.name, age: row.age }
  }

  // ---------- Delete ----------

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id })

    return result.length > 0
  }

  // ---------- 联表示例：用户 + 帖子（LEFT JOIN） ----------

  /**
   * 查询用户列表并左联 posts，每个用户带出其一条帖子（若有多条仅取一条语义需再限定，此处仅演示 JOIN）
   */
  async listUsersWithPosts(limit = 10): Promise<UserWithPost[]> {
    const rows = await this.db
      .select({
        user: users,
        post: posts,
      })
      .from(users)
      .leftJoin(posts, eq(users.id, posts.userId))
      .orderBy(desc(users.id))
      .limit(limit)

    return rows.map(r => ({
      user: {
        id: r.user.id,
        name: r.user.name,
        age: r.user.age,
      },
      post: r.post
        ? { id: r.post.id, title: r.post.title, userId: r.post.userId }
        : null,
    }))
  }

  /**
   * 仅查出「至少有一条帖子」的用户（INNER JOIN）
   */
  async listUsersWhoHavePosts(): Promise<User[]> {
    const rows = await this.db
      .selectDistinct({ id: users.id, name: users.name, age: users.age })
      .from(users)
      .innerJoin(posts, eq(users.id, posts.userId))
      .orderBy(desc(users.id))

    return rows
  }
}

/** 创建用户入参 */
export interface CreateUserInput {
  id: string
  name: string
  age: number
}

/** 更新用户入参（部分字段可选） */
export interface UpdateUserInput {
  name?: string
  age?: number
}

/** 分页列表入参 */
export interface ListUsersInput {
  limit?: number
  offset?: number
}

/** 用户 + 帖子联表结果（LEFT JOIN，post 可能为空） */
export interface UserWithPost {
  user: User
  post: { id: string, title: string, userId: string } | null
}
