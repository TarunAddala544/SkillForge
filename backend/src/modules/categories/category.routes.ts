import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { CategoryController } from "./category.controller";

const router = Router();

router.get("/", authenticate, CategoryController.getAll);

export default router;