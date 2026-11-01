# LearnHub - Online Learning and Course Management System (MERN)

## Features
- User authentication (register / login, JWT, bcrypt)
- Course listing with search and category filter
- Enrollment and a dashboard of enrolled courses
- Progress tracking per module (mark complete / undo) with progress bars
- Admin panel to create, edit and delete courses and modules
- Responsive UI with React + Bootstrap 5

## Prerequisites
Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

## Run it
```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # edit MONGO_URI / JWT_SECRET if needed
npm run seed                # sample courses + demo users
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Demo logins after seeding:
- Admin: admin@lms.com / admin123
- Student: student@lms.com / student123

## API summary
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/auth/me | logged in |
| GET | /api/courses, /api/courses/:id | public |
| POST/PUT/DELETE | /api/courses(/:id) | admin |
| POST | /api/enrollments/:courseId | logged in |
| GET | /api/enrollments/my | logged in |
| GET | /api/enrollments/:courseId | logged in |
| PATCH | /api/enrollments/:courseId/modules/:moduleId/toggle | logged in |

## Folder structure
```
backend/   config, models, middleware, controllers, routes, seed.js, server.js
frontend/  src/{context,components,pages}, vite.config.js (proxies /api to :5000)
```
