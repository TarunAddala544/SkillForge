import { prisma } from '../../config/prisma'

function isFullWeekRange(start: Date, end: Date) {
  const isStartSunday = start.getDay() === 0
  const isEndSaturday = end.getDay() === 6

  const diff =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

  return isStartSunday && isEndSaturday && diff === 6
}

export class DashboardService {
  static async getSummary(userId: string, start?: string, end?: string) {
    const endDate = end ? new Date(end) : new Date()
    const startDate = start
      ? new Date(start)
      : new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

    // 🔥 HYBRID DETECTION
    if (isFullWeekRange(startDate, endDate)) {
      console.log('Using materialized weekly summary')

      const summary = await prisma.weeklySummary.findFirst({
        where: {
          userId,
          weekStart: startDate
        }
      })

      if (summary) {
        const totalGoals = await prisma.goal.count({
          where: { userId }
        })

        const completedGoals = await prisma.goal.count({
          where: {
            userId,
            status: 'COMPLETED'
          }
        })

        const activeGoals = await prisma.goal.count({
          where: {
            userId,
            status: 'ACTIVE'
          }
        })

        return {
          range: { start: startDate, end: endDate },
          totalMinutes: summary.totalMinutes,
          totalProgress: summary.totalProgress,
          totalGoals,
          completedGoals,
          activeGoals,
          categoryBreakdown: []
        }
      }
    }

    // 🔥 OPTIMIZED LIVE AGGREGATION
    console.log('Using optimized live aggregation')

    const aggregate = await prisma.activityLog.aggregate({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        durationMinutes: true,
        numericProgress: true
      }
    })

    const totalMinutes = aggregate._sum.durationMinutes ?? 0
    const totalProgress = aggregate._sum.numericProgress ?? 0

    const grouped = await prisma.activityLog.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        durationMinutes: true
      }
    })

    const categoryIds = grouped.map(g => g.categoryId)

    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds }
      }
    })

    const categoryMap = new Map(
      categories.map(c => [c.id, c.name])
    )

    const categoryBreakdown = grouped.map(g => ({
      category: categoryMap.get(g.categoryId) ?? 'Unknown',
      minutes: g._sum.durationMinutes ?? 0
    }))

    const totalGoals = await prisma.goal.count({
      where: { userId }
    })

    const completedGoals = await prisma.goal.count({
      where: {
        userId,
        status: 'COMPLETED'
      }
    })

    const activeGoals = await prisma.goal.count({
      where: {
        userId,
        status: 'ACTIVE'
      }
    })

    return {
      range: { start: startDate, end: endDate },
      totalMinutes,
      totalProgress,
      totalGoals,
      completedGoals,
      activeGoals,
      categoryBreakdown
    }
  }
}