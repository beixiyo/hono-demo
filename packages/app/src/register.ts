import { applyToContainer, Container } from './core/di'
import { createPgDb, PgDbToken } from './db/client'

import './auth'
import './file'
import './user'
import './sse'
import './websocket'

/** 创建并配置 DI 容器 */
export function createContainer(): Container {
  const container = new Container()

  /**
   * 注册基础设施（数据库等）
   *
   * users 等表当前使用的是 `pgTable`，因此这里显式注册 PostgreSQL 版本的 Db。
   * 若未来需要 SQLite，可在此处额外注册 `SqliteDbToken`，并为其编写独立的 Repository / Service。
   */
  const db = createPgDb()
  container.register({ token: PgDbToken, useValue: db })

  applyToContainer(container)
  return container
}
