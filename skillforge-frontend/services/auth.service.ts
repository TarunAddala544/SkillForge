import api from "@/lib/axios";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};