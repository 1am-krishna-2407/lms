// backend/src/routes/lessonRoutes.js
import express from "express";
import { getLesson, uploadTranscript, audioUpload } from "../controllers/lessonController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:lessonId", protect, getLesson);

// upload audio and auto-generate transcript (stub)
router.post("/:lessonId/transcript", protect, audioUpload.single("audio"), uploadTranscript);

export default router;
