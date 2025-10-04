// backend/src/controllers/learnerController.js
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Certificate from "../models/Certificate.js";

// enroll in course
export const enroll = async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ message: "courseId required" });

  const course = await Course.findById(courseId);
  if (!course || course.status !== "published") return res.status(400).json({ message: "Course not published or not found" });

  const existing = await Enrollment.findOne({ learner: req.user._id, course: courseId });
  if (existing) return res.status(200).json(existing);

  const totalLessons = await Lesson.countDocuments({ course: course._id });
  const enroll = new Enrollment({ learner: req.user._id, course: course._id, progress: 0, completed: false, totalLessons });
  await enroll.save();
  res.json(enroll);
};

// list enrollments for learner
export const listEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ learner: req.user._id }).populate("course");
  // augment with courseTitle
  const out = enrollments.map(e => ({
    _id: e._id,
    course: e.course._id,
    courseTitle: e.course.title,
    progress: e.progress,
    completed: e.completed
  }));
  res.json(out);
};

// mark lesson completed -> update enrollment progress; if 100% issue certificate
export const markLessonComplete = async (req, res) => {
  const { lessonId } = req.body;
  if (!lessonId) return res.status(400).json({ message: "lessonId required" });

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });

  const courseId = lesson.course;
  let enrollment = await Enrollment.findOne({ learner: req.user._id, course: courseId });
  if (!enrollment) return res.status(400).json({ message: "Not enrolled in course" });

  // store per-lesson completion list (we'll store array of lessonIds on enrollment)
  if (!enrollment.completedLessons) enrollment.completedLessons = [];
  if (!enrollment.completedLessons.includes(lesson._id.toString())) {
    enrollment.completedLessons.push(lesson._id.toString());
  }

  // compute progress
  const totalLessons = await Lesson.countDocuments({ course: courseId });
  const done = enrollment.completedLessons.length;
  const percent = totalLessons === 0 ? 0 : Math.round((done / totalLessons) * 100);

  enrollment.progress = percent;
  enrollment.completed = percent === 100;
  enrollment.totalLessons = totalLessons;
  await enrollment.save();

  // Issue certificate if completed and not yet issued
  if (enrollment.completed) {
    const existingCert = await Certificate.findOne({ learner: req.user._id, course: courseId });
    if (!existingCert) {
      const cert = new Certificate({ learner: req.user._id, course: courseId });
      await cert.save();
      return res.json({ message: "Lesson marked. Course completed. Certificate issued.", progress: percent, certificate: cert });
    } else {
      return res.json({ message: "Lesson marked. Course completed. Certificate already exists.", progress: percent, certificate: existingCert });
    }
  }

  res.json({ message: "Lesson marked", progress: percent });
};

// list certificates for current user
export const listCertificates = async (req, res) => {
  const certs = await Certificate.find({ learner: req.user._id }).populate("course").populate("learner");
  // map to frontend-friendly format
  const out = certs.map(c => ({
    _id: c._id,
    serialHash: c.serialHash,
    issuedAt: c.issuedAt,
    courseId: c.course._id,
    courseTitle: c.course.title,
    learnerName: req.user.name
  }));
  res.json(out);
};
