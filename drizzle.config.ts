import type { Config } from 'drizzle-kit'

const pgUser = process.env.POSTGRES_USER ?? 'my_user'
const pgPassword = process.env.POSTGRES_PASSWORD ?? 'my_password'
const pgDatabase = process.env.POSTGRES_DB ?? 'my_database'
const pgHost = process.env.POSTGRES_HOST ?? 'localhost'
const pgPort = process.env.POSTGRES_PORT ?? '5432'

/**
 * Drizzle CLI 配置（PostgreSQL）
 *
 * 常用命令：
 *   - bun x drizzle-kit push: 快速同步，直接执行变更 SQL，适用于单人开发
 *   - bun x drizzle-kit generate: 生成迁移 SQL 文件
 *   - bun x drizzle-kit migrate:  执行迁移
 */
export default {
  schema: './packages/app/src/db/schema.ts',
  out: './packages/app/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? `postgres://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`,
  },
} satisfies Config
