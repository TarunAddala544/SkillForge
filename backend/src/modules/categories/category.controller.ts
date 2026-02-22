import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

export class CategoryController {
  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });

      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}