// backend/routes/authRoutes.js
import express from "express";
import { signup, login, getProfile, forgotPassword, resetPassword } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

import { updateUserSettings } from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.post("/settings", authenticate, updateUserSettings,);

// Forgot/Reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
