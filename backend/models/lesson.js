import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  title: String,
  content: String,
  transcript: String,
  order: Number,
}, { timestamps: true });

export default mongoose.model("Lesson", lessonSchema);
