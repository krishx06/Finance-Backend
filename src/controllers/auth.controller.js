import * as authService from "../services/auth.service.js";
import { success } from "../utils/apiResponse.js";

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    success(res, 201, "User registered", result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    success(res, 200, "Login successful", result);
  } catch (error) {
    next(error);
  }
};
