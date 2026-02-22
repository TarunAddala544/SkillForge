import api from "@/lib/axios";

export interface WeeklySummaryResponse {
  totalMinutes: number;
  totalProgress: number;
  activeGoals: number;
  completedGoals: number;
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    totalMinutes: number;
  }[];
}

export const getWeeklySummary = async (
  startDate: string,
  endDate: string
): Promise<WeeklySummaryResponse> => {
    const response = await api.get("/dashboard/summary", {
    params: { startDate, endDate },
  });

  return response.data;
};

// Fetch categories
export const getCategories = async () => {
    const response = await api.get("/categories");
    return response.data;
  };
  
  // Fetch goals
  export const getGoals = async () => {
    const response = await api.get("/goals");
    return response.data;
  };
  
  // Create activity log
  export const createActivityLog = async (data: {
    goalId: string;
    categoryId: string;
    minutes: number;
    progress: number;
  }) => {
    const response = await api.post("/activity-logs", data);
    return response.data;
  };