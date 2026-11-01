const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' }, // text or video URL
  order: { type: Number, default: 0 },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    category: { type: String, default: 'General' },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
