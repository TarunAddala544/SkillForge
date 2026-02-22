import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import goalRoutes from './modules/goals/goal.routes'
import activityRoutes from './modules/activity/activity.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import { authenticate } from "./middleware/auth.middleware";
import { errorHandler } from './middleware/error.middleware'
import cookieParser from "cookie-parser";
import categoryRoutes from "./modules/categories/category.routes";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/activity-logs', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "You accessed protected route" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 🔥 ERROR HANDLER MUST BE LAST
app.use(errorHandler);