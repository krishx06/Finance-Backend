import express from "express";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", auth, authorizeRoles("admin"), createRecord);
router.get("/", auth, authorizeRoles("admin", "analyst"), getRecords);
router.put("/:id", auth, authorizeRoles("admin"), updateRecord);
router.delete("/:id", auth, authorizeRoles("admin"), deleteRecord);

export default router;
