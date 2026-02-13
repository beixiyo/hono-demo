import { integer, pgTable, text } from 'drizzle-orm/pg-core'

/**
 * 示例：users 表
 *
 * 这里只是演示 Drizzle 的用法，后续可以根据实际业务拆分到对应模块。
 */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
})

/**
 * 示例：posts 表（用于联表示例，关联 users）
 */
export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  userId: text('user_id').notNull(), // 关联 users.id
})
