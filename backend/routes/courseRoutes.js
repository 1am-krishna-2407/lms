// backend/src/routes/courseRoutes.js
import express from "express";
import { listPublished, getCourse, submitForReview } from "../controllers/courseController.js";
import { protect, requireCreator } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listPublished);
router.get("/:id", protect, getCourse); // allow unauthenticated? we set protect to optionally allow; here protect used but frontend sends token
router.post("/:id/submit", protect, requireCreator, submitForReview);

export default router;
