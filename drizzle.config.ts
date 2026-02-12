import type { Config } from 'drizzle-kit'

/**
 * Drizzle CLI 配置（PostgreSQL）
 *
 * 常用命令：
 *   - bunx drizzle-kit generate: 生成迁移
 *   - bunx drizzle-kit migrate:  执行迁移
 */
export default {
  schema: './packages/app/src/db/schema.ts',
  out: './packages/app/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
} satisfies Config
