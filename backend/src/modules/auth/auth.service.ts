import { prisma } from "../../config/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt";
import { AppError } from "../../utils/AppError";

export const registerUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Do not reveal whether email exists (security best practice)
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
};