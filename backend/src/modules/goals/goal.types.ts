export interface CreateGoalInput {
    title: string
    description?: string
    targetValue?: number
    deadline?: string
    categoryId: string
  }

  export interface UpdateGoalInput {
    title?: string
    description?: string
    targetValue?: number
    deadline?: string
    status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  }