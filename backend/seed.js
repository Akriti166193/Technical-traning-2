require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const mods = (...titles) => titles.map((t, i) => ({ title: t, content: `Lesson content for: ${t}`, order: i + 1 }));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Course.deleteMany(), Enrollment.deleteMany()]);

  await User.create({ name: 'Admin', email: 'admin@lms.com', password: 'admin123', role: 'admin' });
  await User.create({ name: 'Demo Student', email: 'student@lms.com', password: 'student123' });

  await Course.create([
    { title: 'Python for Beginners', description: 'Learn Python from scratch: syntax, data types, functions and OOP.', instructor: 'Riya Sharma', category: 'Programming',
      modules: mods('Introduction & Setup', 'Variables and Data Types', 'Control Flow', 'Functions', 'Object-Oriented Python') },
    { title: 'SQL & Database Design', description: 'Write queries, design schemas and understand normalization.', instructor: 'Amit Verma', category: 'Database',
      modules: mods('Relational Basics', 'SELECT and Filtering', 'Joins', 'Aggregations', 'Normalization') },
    { title: 'Responsive Web with Bootstrap', description: 'Build mobile-first layouts using the Bootstrap grid and components.', instructor: 'Neha Singh', category: 'Web',
      modules: mods('Grid System', 'Typography & Utilities', 'Components', 'Forms', 'Building a Landing Page') },
    { title: 'React Fundamentals', description: 'Components, props, state, hooks and routing.', instructor: 'Karan Mehta', category: 'Web',
      modules: mods('JSX and Components', 'Props and State', 'Hooks', 'React Router', 'Calling APIs') },
  ]);

  console.log('Seeded. Admin: admin@lms.com / admin123 | Student: student@lms.com / student123');
  process.exit(0);
})();
