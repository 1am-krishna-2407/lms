// backend/src/routes/certificateRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import { listCertificates, downloadCertificate } from "../controllers/certificateController.js";

const router = express.Router();

router.get("/", protect, listCertificates);
router.get("/:id/download", protect, downloadCertificate);

export default router;
