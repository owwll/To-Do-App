# Taskflow - Setup Guide

A beautifully crafted to-do app with integrated backend and authentication.

## Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account (cloud MongoDB)
- Git

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_API_URL=http://localhost:5000/api
```

### 3. Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
PORT=5000
JWT_SECRET=your_super_secret_key_change_in_production_12345
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority&appName=Cluster0
CLIENT_ORIGIN=http://localhost:5173,http://localhost:8080
```

#### MongoDB Connection String Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster if you don't have one
3. Click "Connect" on your cluster
4. Select "Drivers" and copy your connection string
5. Replace `<username>`, `<password>`, and `<cluster>` with your actual credentials
6. Update the `MONGODB_URI` in your `.env` file

### 4. Start Development Server

```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### 5. Start Production Server

```bash
npm start
```

## Running Both Servers Simultaneously

From the root directory, use:

```bash
npm run server:dev
```

This starts the backend development server with hot-reload (requires nodemon).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user profile (requires token)

### Tasks

- `GET /api/tasks` - Fetch all tasks for the logged-in user
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

All task endpoints require JWT authentication.

## Authentication Flow

1. User registers or logs in via the frontend
2. Backend returns a JWT token
3. Token is stored in `localStorage`
4. Token is included in `Authorization: Bearer <token>` header for all API requests
5. Backend validates token and permits/denies access

## Project Structure

```
your-daily-tasks/
├── backend/                 # Express backend
│   ├── src/
│   │   ├── server.js       # Express app initialization
│   │   ├── config/db.js    # MongoDB connection
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth middleware
│   │   └── routes/         # API routes
│   └── package.json
├── src/                     # React frontend
│   ├── pages/              # Page components
│   ├── components/         # UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities (API client)
│   └── main.tsx            # Entry point
└── package.json
```

## Troubleshooting

### MongoDB Connection Error

- Make sure MongoDB Atlas cluster is active
- Check username and password are correct
- Verify IP is whitelisted in Atlas (allow from anywhere for development)
- Ensure connection string has correct cluster name

### CORS Errors

- Backend should be running on `http://localhost:5000`
- Frontend might be on `http://localhost:5173` or `http://localhost:8080`
- Check `CLIENT_ORIGIN` in backend `.env`

### Token Missing/Expired

- Clear browser localStorage: `localStorage.clear()`
- Refresh the page and log in again
- Ensure `.env` has correct `JWT_SECRET`

## Development Workflow

1. Start backend server: `cd backend && npm run dev`
2. In another terminal, start frontend: `npm run dev`
3. Open `http://localhost:5173` in your browser
4. Make changes to code (both auto-reload)
5. Test API integration through the UI

## Testing API with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get tasks (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

## Deployment

### Frontend Deployment (Vercel, Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables:
   - `VITE_API_URL` = your backend API URL
4. Deploy

### Backend Deployment (Render, Railway, Heroku)

1. Push code to GitHub
2. Connect repository to your hosting provider
3. Set environment variables (MongoDB URI, JWT_SECRET, CLIENT_ORIGIN)
4. Deploy

## Contributing

Please follow conventional commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks
- `docs:` - Documentation updates
