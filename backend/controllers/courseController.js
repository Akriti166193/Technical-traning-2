const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

exports.list = async (req, res) => {
  const { search, category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };
  const courses = await Course.find(filter).select('-modules.content').sort('-createdAt');
  res.json(courses);
};

exports.get = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
};

exports.create = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};

exports.update = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
};

exports.remove = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  await Enrollment.deleteMany({ course: course._id });
  res.json({ message: 'Course deleted' });
};
