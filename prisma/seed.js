const fs = require('node:fs')
const path = require('node:path')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

const envPath = path.resolve(__dirname, '../.env')

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')

  for (const line of envContent.split('\n')) {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmedLine.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const value = trimmedLine.slice(separatorIndex + 1).trim()

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:open_erp@localhost:5439/open_erp?schema=public'

const adapter = new PrismaPg(
  new Pool({
    connectionString,
  }),
)

const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.SEED_USER_EMAIL || 'admin@example.com'
  const password = process.env.SEED_USER_PASSWORD || '12345678'
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
    },
  })

  console.log('Seeded user:')
  console.log(`- email: ${user.email}`)
  console.log(`- password: ${password}`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
