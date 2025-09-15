// backend/routes/walletRoutes.js
import express from "express";
import { getWallet, initPaystack, verifyPaystack } from "../controllers/walletController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getWallet);
router.post("/paystack/init", authenticate, initPaystack);
router.post("/paystack/verify", authenticate, verifyPaystack);

export default router;
