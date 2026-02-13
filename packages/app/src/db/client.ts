import type { Token } from '@/core/di'
import { SQL } from 'bun'
import { Database } from 'bun:sqlite'
import { drizzle as drizzleBunSql } from 'drizzle-orm/bun-sql'
import { drizzle as drizzleSqlite } from 'drizzle-orm/bun-sqlite'

/**
 * @description
 * Drizzle ORM 客户端（双配置：PostgreSQL / SQLite）
 */

export type PgDb = ReturnType<typeof drizzleBunSql>
export type SqliteDb = ReturnType<typeof drizzleSqlite>
export const PgDbToken: Token<PgDb> = Symbol('PgDb')
export const SqliteDbToken: Token<SqliteDb> = Symbol('SqliteDb')

/**
 * 优先使用 DATABASE_URL；若未配置，则根据 POSTGRES_* 环境变量拼接，
 * 并使用 docker/postgres.yml 中的默认值：
 */
const pgUser = process.env.POSTGRES_USER ?? 'my_user'
const pgPassword = process.env.POSTGRES_PASSWORD ?? 'my_password'
const pgDatabase = process.env.POSTGRES_DB ?? 'my_database'
const pgHost = process.env.POSTGRES_HOST ?? 'localhost'
const pgPort = process.env.POSTGRES_PORT ?? '5432'

/**
 * 创建 PostgreSQL 版本 Db（Bun SQL + drizzle-orm/bun-sql）
 */
export function createPgDb(): PgDb {
  const pgUrl
    = process.env.DATABASE_URL
      ?? `postgres://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`

  if (!pgUrl)
    throw new Error('DATABASE_URL is not set (for PostgreSQL via Bun SQL)')

  const pgClient = new SQL(pgUrl)
  return drizzleBunSql({ client: pgClient })
}

/**
 * 创建 SQLite 版本 Db（bun:sqlite + drizzle-orm/bun-sqlite）
 */
export function createSqliteDb(): SqliteDb {
  const sqlite = new Database('db.sqlite')
  return drizzleSqlite(sqlite)
}
