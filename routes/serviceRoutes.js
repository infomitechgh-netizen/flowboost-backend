// backend/routes/serviceRoutes.js
import express from "express";
import { getServices, syncDripFeedServices } from "../controllers/serviceController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();
import { getServicesByCategory } from "../controllers/serviceController.js";

router.get("/services/by-category", getServicesByCategory);

router.get("/", authenticate, getServices);
router.post("/", authenticate); // For creating services
router.post("/sync", authenticate, syncDripFeedServices);





export default router;
