import * as dashboardService from "../services/dashboard.service.js";

export const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary();
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};

export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryBreakdown();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getMonthlyBreakdown();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
