import express from "express";
import { createOrder, getOrders, refillOrder, getTotalOrdersCount, submitOrderToDripFeed, getActiveOrdersCount, getCompletedOrdersCount } from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { reorderService } from "../controllers/orderController.js";
import { updateOrderStatus} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrders);
router.post("/:id/refill", authenticate, refillOrder);
router.post("/:id/submit", authenticate, submitOrderToDripFeed);

// ✅ New route to fetch active orders count
router.get("/active-count", authenticate, getActiveOrdersCount);
// ✅ New route to fetch completed orders count
router.get("/completed-count", authenticate, getCompletedOrdersCount);
// ✅ New route to fetch total orders count
router.get("/total-count", authenticate, getTotalOrdersCount);
// In orderRoutes.js
router.post("/:id/reorder", authenticate, reorderService);

// Update order status (Admin only)
router.patch("/:id/status", authenticate, updateOrderStatus);

export default router;
