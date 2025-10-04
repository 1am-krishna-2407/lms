// backend/src/controllers/adminController.js
import Course from "../models/Course.js";
import User from "../models/User.js";

// list pending courses
export const listPendingCourses = async (req, res) => {
  const courses = await Course.find({ status: "pending" }).populate("creator");
  res.json(courses);
};

export const approveCourse = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Not found" });

  course.status = "published";
  await course.save();
  res.json({ message: "Course published" });
};

export const rejectCourse = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Not found" });

  // simple reject -> set to draft or remove; we mark as draft
  course.status = "draft";
  await course.save();
  res.json({ message: "Course rejected (moved to draft)" });
};

// Approve creator application: set user.approvedCreator = true
export const approveCreator = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.approvedCreator = true;
  user.role = "creator";
  await user.save();
  res.json({ message: "Creator approved" });
};
