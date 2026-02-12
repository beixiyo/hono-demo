import type { Token } from '@/core/di'
import { SQL } from 'bun'
import { Database } from 'bun:sqlite'
import { drizzle as drizzleBunSql } from 'drizzle-orm/bun-sql'
import { drizzle as drizzleSqlite } from 'drizzle-orm/bun-sqlite'

/**
 * Drizzle ORM 客户端（双配置：PostgreSQL / SQLite）
 *
 * A 方案：**明确区分不同方言的 Db 与 Token**
 *
 * - PostgreSQL：通过 Bun SQL（bun-sql）连接，对应 `PgDb` / `PgDbToken` / `createPgDb`
 * - SQLite：通过 bun:sqlite 连接，对应 `SqliteDb` / `SqliteDbToken` / `createSqliteDb`
 *
 * Service 层应显式依赖某一种方言的 Db 类型（例如 users 表当前使用的是 `pgTable`，
 * 则应注入 `PgDb`，而不是把 Pg / Sqlite 混成一个联合类型）。
 */

export type PgDb = ReturnType<typeof drizzleBunSql>
export type SqliteDb = ReturnType<typeof drizzleSqlite>
/** DI Token：PostgreSQL 版本 Db（与使用 `pgTable` 的 schema 搭配） */
export const PgDbToken: Token<PgDb> = Symbol('PgDb')
/** DI Token：SQLite 版本 Db（与使用 `sqliteTable` 的 schema 搭配） */
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
