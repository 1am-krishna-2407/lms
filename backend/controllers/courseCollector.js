// backend/src/controllers/courseController.js
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

// List published courses - learners
export const listPublished = async (req, res) => {
  const courses = await Course.find({ status: "published" }).populate({ path: "lessons", options: { sort: { order: 1 } } });
  res.json(courses);
};

export const getCourse = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate({ path: "lessons", options: { sort: { order: 1 } } });
  if (!course) return res.status(404).json({ message: "Course not found" });

  // if the course is not published, only owner or admin may view
  if (course.status !== "published") {
    // allow creator or admin
    if (!req.user || (req.user._id.toString() !== course.creator.toString() && req.user.role !== "admin")) {
      return res.status(403).json({ message: "Course not published" });
    }
  }

  res.json(course);
};

// Creator submits course for review
export const submitForReview = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (course.creator.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not owner" });

  course.status = "pending";
  await course.save();
  res.json({ message: "Course submitted for review" });
};
