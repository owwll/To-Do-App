# Your Daily Tasks (MERN)

A full stack to-do application with:
- React + Vite frontend
- Node.js + Express backend
- MongoDB Atlas database
- JWT authentication

## Features

- Register with name, email, password (validation included)
- Login with JWT auth
- Protected dashboard routes
- Add, view, edit, complete, delete tasks
- Filter tasks by all/pending/completed

## Project Structure

- frontend: current root project files in [src]
- backend: [backend]

## Local Setup

### 1) Frontend setup

Use [.env](.env):

```env
VITE_API_URL=http://localhost:5000/api
```

Install and run frontend:

```bash
npm install
npm run dev
```

### 2) Backend setup

Go to [backend](backend), copy [backend/.env.example](backend/.env.example) to [backend/.env](backend/.env), then set values:

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<db-name>?retryWrites=true&w=majority&appName=Cluster0
CLIENT_ORIGIN=http://localhost:5173
```

Install and run backend:

```bash
cd backend
npm install
npm run dev
```

## API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/tasks
- GET /api/tasks
- PATCH /api/tasks/:id
- DELETE /api/tasks/:id

## Submission Checklist

- Push this full code to GitHub
- Deploy frontend to Vercel
- (Optional) Deploy backend to Render/Railway
