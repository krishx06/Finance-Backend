import * as userService from "../services/user.service.js";

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
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
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};