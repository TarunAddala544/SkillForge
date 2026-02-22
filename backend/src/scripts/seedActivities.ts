import { prisma } from '../config/prisma'

async function seed() {
  const userId = 'f84e1fc5-401e-473c-8982-fe658dd9e484'
  const categoryId = '973df15c-11b4-42b5-9967-c170009b5549'

  for (let i = 0; i < 500; i++) {
    await prisma.activityLog.create({
      data: {
        userId,
        categoryId,
        date: new Date('2026-02-22'),
        durationMinutes: Math.floor(Math.random() * 60),
        numericProgress: Math.floor(Math.random() * 5)
      }
    })
  }

  console.log('Inserted 500 activity logs')
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect())