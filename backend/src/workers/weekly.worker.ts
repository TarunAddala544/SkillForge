import { redis } from '../config/redis'
import { prisma } from '../config/prisma'

function getWeekStart(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

async function startWorker() {
  console.log('Weekly worker started...')

  while (true) {
    const result = await redis.brpop('activity_events', 0)

    if (!result) continue

    const [, eventString] = result
    const event = JSON.parse(eventString)

    if (event.type === 'ACTIVITY_CREATED') {
      const weekStart = getWeekStart(new Date(event.date))

      await prisma.weeklySummary.upsert({
        where: {
          userId_weekStart: {
            userId: event.userId,
            weekStart
          }
        },
        update: {
          totalMinutes: {
            increment: event.durationMinutes
          },
          totalProgress: {
            increment: event.numericProgress ?? 0
          }
        },
        create: {
          userId: event.userId,
          weekStart,
          totalMinutes: event.durationMinutes,
          totalProgress: event.numericProgress ?? 0
        }
      })

      console.log('Weekly summary updated')
    }
  }
}

startWorker()