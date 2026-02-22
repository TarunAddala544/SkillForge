import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "./auth.service";
import { prisma } from "../../config/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { AppError } from "../../utils/AppError";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser(email, password);

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const tokens = await loginUser(email, password);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token required", 401);
    }

    const decoded = verifyRefreshToken(refreshToken) as any;

    const existingToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!existingToken) {
      throw new AppError("Invalid refresh token", 403);
    }

    if (existingToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
      throw new AppError("Refresh token expired", 403);
    }

    // Rotation
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};