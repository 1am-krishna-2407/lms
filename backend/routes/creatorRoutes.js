// backend/src/routes/creatorRoutes.js
import express from "express";
import multer from "multer";
import { protect, requireCreator } from "../middleware/auth.js";
import {
  applyCreator,
  createCourse,
  listCreatorCourses,
  createLesson,
  reorderLessons
} from "../controllers/creatorController.js";

const router = express.Router();

router.post("/apply", protect, applyCreator);

// creator CRUD
router.post("/courses", protect, requireCreator, createCourse);
router.get("/courses", protect, requireCreator, listCreatorCourses);

// lessons under creator
router.post("/courses/:courseId/lessons", protect, requireCreator, createLesson);
router.post("/courses/:courseId/reorder", protect, requireCreator, reorderLessons);

export default router;
