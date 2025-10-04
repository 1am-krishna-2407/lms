// backend/src/controllers/certificateController.js
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import PDFDocument from "pdfkit";

// list (for current user)
export const listCertificates = async (req, res) => {
  const certs = await Certificate.find({ learner: req.user._id }).populate("course");
  res.json(certs);
};

// download as PDF
export const downloadCertificate = async (req, res) => {
  const { id } = req.params;
  const cert = await Certificate.findById(id).populate("course").populate("learner");
  if (!cert) return res.status(404).json({ message: "Certificate not found" });
  if (cert.learner._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed" });
  }

  // Create PDF with pdfkit
  const doc = new PDFDocument({ size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=certificate_${cert._id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text("Certificate of Completion", { align: "center" });
  doc.moveDown(2);
  doc.fontSize(14).text(`This certifies that ${cert.learner.name}`, { align: "center" });
  doc.moveDown(1);
  doc.fontSize(12).text(`has completed the course "${cert.course.title}"`, { align: "center" });
  doc.moveDown(2);
  doc.text(`Issued on: ${cert.issuedAt.toUTCString()}`, { align: "center" });
  doc.moveDown(1);
  doc.text(`Serial: ${cert.serialHash}`, { align: "center" });

  doc.end();
};
