import express from "express";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyBreakdown,
  getRecentActivity,
} from "../controllers/dashboard.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/summary", auth, getSummary);
router.get("/category", auth, getCategoryBreakdown);
router.get("/monthly", auth, getMonthlyBreakdown);
router.get("/recent", auth, getRecentActivity);

export default router;
