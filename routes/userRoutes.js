// backend/routes/userRoutes.js
import express from "express";
import { getProfile } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", authenticate, getProfile);

export default router;
