// backend/src/controllers/creatorController.js
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";

export const applyCreator = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = "creator";
  user.approvedCreator = false; // admin must approve
  await user.save();
  res.json({ message: "Creator application submitted" });
};

export const createCourse = async (req, res) => {
  // requires creator & approved (middleware)
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });

  const c = new Course({ title, description, creator: req.user._id, status: "draft", lessons: [] });
  await c.save();
  res.json(c);
};

export const listCreatorCourses = async (req, res) => {
  const courses = await Course.find({ creator: req.user._id }).populate("lessons").sort({ createdAt: -1 });
  res.json(courses);
};

// Create lesson with order uniqueness enforcement
export const createLesson = async (req, res) => {
  const { courseId } = req.params;
  const { title, content, transcript, order } = req.body;
  if (order == null) return res.status(400).json({ message: "Lesson order is required and must be a number" });

  // validate course belongs to this creator
  const course = await Course.findById(courseId).populate("lessons");
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (course.creator.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not course owner" });

  // check unique order
  const exists = await Lesson.findOne({ course: course._id, order });
  if (exists) return res.status(400).json({ message: `Lesson order ${order} already exists in this course` });

  const lesson = new Lesson({ course: course._id, title, content, transcript, order });
  await lesson.save();

  course.lessons.push(lesson._id);
  await course.save();

  res.json(lesson);
};

// Reorder endpoint (optional) - accepts array of { lessonId, order }
export const reorderLessons = async (req, res) => {
  const { courseId } = req.params;
  const updates = req.body; // expect [{lessonId, order}, ...]
  if (!Array.isArray(updates)) return res.status(400).json({ message: "Invalid payload, expected array" });

  const course = await Course.findById(courseId).populate("lessons");
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (course.creator.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not course owner" });

  // Check uniqueness within payload
  const orders = updates.map(u => u.order);
  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) return res.status(400).json({ message: "Duplicate orders in request" });

  // Apply updates (validate lessons belong to course)
  for (const u of updates) {
    const lesson = await Lesson.findById(u.lessonId);
    if (!lesson) return res.status(404).json({ message: `Lesson ${u.lessonId} not found` });
    if (lesson.course.toString() !== course._id.toString()) return res.status(400).json({ message: "One or more lessons do not belong to the course" });
  }

  // All good: update orders
  for (const u of updates) {
    await Lesson.findByIdAndUpdate(u.lessonId, { order: u.order }, { new: true });
  }

  res.json({ message: "Reordered" });
};
