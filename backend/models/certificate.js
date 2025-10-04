import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedLessons: [{ type: String }], // store lessonId strings
  totalLessons: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Enrollment", enrollmentSchema);
