import express from "express";
import {
  createUser,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../controllers/user.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", auth, authorizeRoles("admin"), createUser);

router.get("/", auth, authorizeRoles("admin"), getUsers);

router.patch("/:id/role", auth, authorizeRoles("admin"), updateUserRole);

router.patch("/:id/status", auth, authorizeRoles("admin"), updateUserStatus);

export default router;