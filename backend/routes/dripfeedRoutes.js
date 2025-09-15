import express from "express";
import { getDripfeedServices, createDripfeedOrder } from "../controllers/dripfeedController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/services", authenticate, getDripfeedServices);
router.post("/order", authenticate, createDripfeedOrder);

export default router;
