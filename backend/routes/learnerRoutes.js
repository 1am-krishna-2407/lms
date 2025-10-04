// backend/src/routes/learnerRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import { enroll, listEnrollments, markLessonComplete, listCertificates } from "/controllers/learnerController.js";
import { listCertificates as listCertController } from "../controllers/certificateController.js";

const router = express.Router();

router.post("/enroll", protect, enroll);
router.get("/enrollments", protect, listEnrollments);
router.post("/progress", protect, markLessonComplete);

// certificate list (alias)
router.get("/certificate", protect, listCertificates);
router.get("/certificate/list", protect, listCertController);

export default router;
