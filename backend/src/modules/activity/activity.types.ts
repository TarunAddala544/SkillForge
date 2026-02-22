export interface CreateActivityInput {
    date: string
    durationMinutes: number
    numericProgress?: number
    notes?: string
    categoryId: string
    goalId?: string
  }