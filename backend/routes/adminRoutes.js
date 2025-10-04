// backend/src/routes/adminRoutes.js
import express from "express";
import { protect, requireAdmin } from "../middleware/auth.js";
import { listPendingCourses, approveCourse, rejectCourse, approveCreator } from "../controllers/adminController.js";

const router = express.Router();

router.get("/courses/pending", protect, requireAdmin, listPendingCourses);
router.post("/courses/:id/approve", protect, requireAdmin, approveCourse);
router.post("/courses/:id/reject", protect, requireAdmin, rejectCourse);

// approve creator
router.post("/creator/:userId/approve", protect, requireAdmin, approveCreator);

export default router;
