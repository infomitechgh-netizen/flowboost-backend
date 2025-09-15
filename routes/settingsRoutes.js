// backend/routes/settingsRoutes.js
import express from "express";
import { getUserSettings, updateUserSettings } from "../controllers/settingsController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getUserSettings);
router.put("/", authenticate, updateUserSettings);

export default router;
