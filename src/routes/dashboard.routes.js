import express from "express";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyBreakdown,
} from "../controllers/dashboard.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/summary", auth, getSummary);
router.get("/category", auth, getCategoryBreakdown);
router.get("/monthly", auth, getMonthlyBreakdown);

export default router;
