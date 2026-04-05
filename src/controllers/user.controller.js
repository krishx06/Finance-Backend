import * as userService from "../services/user.service.js";
import { success } from "../utils/apiResponse.js";

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    success(res, 201, "User created", user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    success(res, 200, "Users fetched", users);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRole(
      req.params.id,
      req.body.role
    );
    success(res, 200, "User role updated", user);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await userService.updateUserStatus(
      req.params.id,
      req.body.status
    );
    success(res, 200, "User status updated", user);
  } catch (error) {
    next(error);
  }
};