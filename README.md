# Team Task Manager

Modern SaaS-style team task management platform built with React, Express, and MongoDB. It supports projects, team collaboration, role-based access, and insightful dashboards.

## Features
- User authentication with JWT (signup, login, logout, persistent sessions)
- Role-based access control (admin/member)
- Project management with member invites and progress tracking
- Task management with filters, search, sorting, and status updates
- Analytics dashboard with charts and activity feed
- Responsive SaaS dashboard UI, toast notifications, empty states, and loading skeletons

## Tech Stack
**Frontend:** React + Vite, Tailwind CSS, React Router, Axios, React Hook Form + Zod, Framer Motion, Recharts  
**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs  
**Deployment:** Railway-ready with environment variables

---

## Getting Started

### 1) Clone & install dependencies
```bash
cd server
npm install

cd ../client
npm install
```

### 2) Environment variables
Create `.env` files from the examples:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3) Run locally
```bash
# backend
cd server
npm run dev

# frontend
cd ../client
npm run dev
```

Open `http://localhost:5173`

---

## Environment Variables

### Backend (`server/.env`)
```
PORT=5000
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:5000
```

---

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `PUT /api/projects/:id/members`

### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Users (Admin)
- `GET /api/users`

---

## Railway Deployment

### Backend service
1. Create a new Railway project and add a **Node.js** service.
2. Set the **root directory** to `server`.
3. Configure environment variables from `server/.env.example`.
4. Deploy (Railway uses `npm start`).

### Frontend service
1. Add another service (Static or Node.js).
2. Set the **root directory** to `client`.
3. Add `VITE_API_URL` pointing to the backend URL.
4. Build command: `npm install && npm run build`
5. Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`

---

## Demo Flow
1. Signup/Login
2. Create a project (Admin)
3. Add members
4. Create and assign tasks
5. Update task status
6. View analytics in Dashboard

---

## Screenshots
Add screenshots here once deployed.

---

## License
MIT
