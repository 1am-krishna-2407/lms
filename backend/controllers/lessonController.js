// backend/src/controllers/lessonController.js
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// configure multer storage for audio
const audioFolder = path.join(process.cwd(), "uploads", "audio");
if (!fs.existsSync(audioFolder)) fs.mkdirSync(audioFolder, { recursive: true });

export const audioUpload = multer({ dest: audioFolder });

// get lesson
export const getLesson = async (req, res) => {
  const { lessonId } = req.params;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  res.json(lesson);
};

// upload audio and generate transcript (stub)
export const uploadTranscript = async (req, res) => {
  const { lessonId } = req.params;
  if (!req.file) return res.status(400).json({ message: "Audio file required" });

  // SAVE: file is already saved to disk by multer
  // Here you would call actual STT (OpenAI Whisper, Google Speech-to-Text, etc.)
  // For now we create a deterministic stub transcript:
  const filename = req.file.originalname || req.file.filename;
  const transcriptText = `Transcription (auto-generated stub) for file: ${filename}.\n\n(Replace with real STT integration.)`;

  // update lesson
  const lesson = await Lesson.findByIdAndUpdate(lessonId, { transcript: transcriptText }, { new: true });
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });

  res.json({ message: "Transcript generated (stub)", transcript: transcriptText });
};
