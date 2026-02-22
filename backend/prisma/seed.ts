import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    {
      name: 'DSA',
      description: 'Data Structures and Algorithms practice'
    },
    {
      name: 'SQL',
      description: 'SQL queries and database concepts'
    },
    {
      name: 'Projects',
      description: 'Software projects and system design work'
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
  }

  console.log('✅ Default categories seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })