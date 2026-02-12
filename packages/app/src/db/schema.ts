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
