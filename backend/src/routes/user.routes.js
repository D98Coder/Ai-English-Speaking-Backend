import express from "express";
import Joi from "joi";
import {
    changePassword,
    deleteAccount,
    getProfile,
    getUserStats,
    updateProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile routes
router.get("/profile", getProfile);
router.put(
  "/profile",
  validate(
    Joi.object({
      name: Joi.string().min(2).max(50),
      englishLevel: Joi.string().valid("basic", "intermediate", "advanced"),
    }),
  ),
  updateProfile,
);

// Password change
router.put(
  "/change-password",
  validate(
    Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
    }),
  ),
  changePassword,
);

// Statistics
router.get("/stats", getUserStats);

// Account deletion
router.delete("/account", deleteAccount);

export default router;
