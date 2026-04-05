import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const createUser = async (data) => {
  const salt = await bcrypt.genSalt(10);
  data.password = await bcrypt.hash(data.password, salt);
  const user = await User.create(data);
  return user;
};

export const findByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const updateUserRole = async (userId, role) => {
  return await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password");
};

export const updateUserStatus = async (userId, status) => {
  return await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  ).select("-password");
};