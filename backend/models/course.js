import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  status: { type: String, enum: ["draft", "pending", "published"], default: "draft" },
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
