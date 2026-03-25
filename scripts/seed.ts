import { config } from 'dotenv'
config({ path: '.env.local' })

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { users } from '../lib/db/schema'
import bcrypt from 'bcryptjs'

const ADMIN_EMAIL    = 'admin@yourcompany.com'   // ← 改成你的邮箱
const ADMIN_PASSWORD = 'ChangeMe123!'             // ← 改成你的密码
const ADMIN_NAME     = '管理员'

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const db   = drizzle(pool)
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12)
  const [user] = await (db.insert(users) as any).values({
    email: ADMIN_EMAIL, name: ADMIN_NAME, password: hash, role: 'admin',
  }).onConflictDoUpdate({ target: users.email, set: { name: ADMIN_NAME, password: hash } }).returning()
  console.log(`✅ 管理员账号已创建：${user.email}`)
  console.log(`   初始密码：${ADMIN_PASSWORD}`)
  await pool.end()
}

main().catch(e => { console.error('❌ 失败：', e); process.exit(1) })
