import * as dashboardService from "../services/dashboard.service.js";
import { success } from "../utils/apiResponse.js";

export const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary();
    success(res, 200, "Summary fetched", summary);
  } catch (error) {
    next(error);
  }
};

export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryBreakdown();
    success(res, 200, "Category breakdown fetched", data);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getMonthlyBreakdown();
    success(res, 200, "Monthly breakdown fetched", data);
  } catch (error) {
    next(error);
  }
};
