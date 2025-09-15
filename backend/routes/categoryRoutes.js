import express from "express";
import { getCategories } from "../controllers/categoryController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getCategories);

export default router;
