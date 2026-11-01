const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const withProgress = (enr) => {
  const total = enr.course?.modules?.length || 0;
  const done = enr.completedModules.length;
  return { ...enr.toObject(), progress: total ? Math.round((done / total) * 100) : 0 };
};

exports.enroll = async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  try {
    const enr = await Enrollment.create({ user: req.user._id, course: course._id });
    res.status(201).json(enr);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already enrolled' });
    throw err;
  }
};

exports.myEnrollments = async (req, res) => {
  const list = await Enrollment.find({ user: req.user._id }).populate('course').sort('-createdAt');
  res.json(list.filter((e) => e.course).map(withProgress));
};

exports.getOne = async (req, res) => {
  const enr = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId }).populate('course');
  if (!enr) return res.status(404).json({ message: 'Not enrolled in this course' });
  res.json(withProgress(enr));
};

exports.toggleModule = async (req, res) => {
  const { courseId, moduleId } = req.params;
  const enr = await Enrollment.findOne({ user: req.user._id, course: courseId }).populate('course');
  if (!enr) return res.status(404).json({ message: 'Not enrolled in this course' });
  if (!enr.course.modules.id(moduleId)) return res.status(404).json({ message: 'Module not found' });

  const idx = enr.completedModules.findIndex((m) => m.toString() === moduleId);
  if (idx === -1) enr.completedModules.push(moduleId);
  else enr.completedModules.splice(idx, 1); // un-mark if already done
  await enr.save();
  res.json(withProgress(enr));
};
