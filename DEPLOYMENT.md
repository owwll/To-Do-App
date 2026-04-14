# Deployment Guide - Render & Vercel

This guide covers deployment of Taskflow to Render (backend) and Vercel (frontend).

## Backend Deployment on Render

### Prerequisites

- Render account (https://render.com)
- MongoDB Atlas account with database
- GitHub repository connected to Render

### Step 1: Prepare MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user (if not already created):
   - Click "Network Access" → "Add IP Address"
   - Allow from anywhere: `0.0.0.0/0` (for development/testing)
   - Or whitelist Render's IP: `0.0.0.0/0`
3. Get connection string:
   - Click "Databases" → "Connect" on your cluster
   - Select "Drivers" → Copy connection string
   - Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`

### Step 2: Create Web Service on Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
   - Click "Connect Account" if needed
   - Select `your-daily-tasks` repository
4. Configure the service:
   - **Name**: `taskflow-backend` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (for testing) or Starter ($7/month)

### Step 3: Add Environment Variables

In Render dashboard, go to your service → **"Environment"** tab:

```
JWT_SECRET=your_super_secret_key_minimum_32_chars_change_this_12345
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskflow?retryWrites=true&w=majority
CLIENT_ORIGIN=https://your-vercel-domain.vercel.app,http://localhost:5173
PORT=10000
```

**Important Notes:**
- Replace `<username>`, `<password>`, `<cluster>`, and `taskflow` with your actual values
- `JWT_SECRET` must be at least 32 characters
- `CLIENT_ORIGIN` must include your Vercel frontend URL (add it after Vercel deployment)
- Render provides a default `PORT` (usually 10000)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy when you push to GitHub
3. Wait for deployment to complete (usually 2-3 minutes)
4. Your backend URL will be: `https://taskflow-backend.onrender.com` (or similar)
5. Test health endpoint: `https://taskflow-backend.onrender.com/api/health`

### Step 5: Monitor Logs

- Go to your service → **"Logs"** tab
- Watch for any errors during startup
- If MongoDB connection fails, verify:
  - Connection string is correct
  - IP whitelist includes Render's servers
  - Database user credentials are valid

### Auto-Deploy on GitHub Push

Render automatically redeploys when you push to GitHub. To disable auto-deploy:
- Go to service settings → "Auto-Deploy" → Toggle off

---

## Frontend Deployment on Vercel

### Prerequisites

- Vercel account (https://vercel.com)
- GitHub repository
- Render backend URL (from previous steps)

### Step 1: Update Frontend Configuration

In your local repo, update the `.env.example` in root directory (for reference):

```bash
VITE_API_URL=https://taskflow-backend.onrender.com/api
```

**Note:** Do NOT add this to `.env` or commit it. Set it in Vercel dashboard instead.

### Step 2: Deploy on Vercel

#### Option A: GitHub Integration (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

#### Option B: Manual (CLI)

```bash
npm install -g vercel
vercel
```

### Step 3: Configure Vercel Project

In Vercel dashboard:

1. Go to your project → **"Settings"** tab
2. Click **"Environment Variables"**
3. Add environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://taskflow-backend.onrender.com/api` (your Render backend URL)
   - **Environments**: Production, Preview, Development
4. Click **"Save"**

### Step 4: Deploy

1. Vercel will automatically deploy on GitHub push
2. Check **"Deployments"** tab for status
3. Your frontend URL: `https://your-project.vercel.app`
4. Test by logging in - it should connect to your Render backend

### Step 5: Update Backend CLIENT_ORIGIN

After Vercel deployment:

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Select your `taskflow-backend` service
3. Go to **"Environment"** tab
4. Edit `CLIENT_ORIGIN`:
   ```
   https://your-project.vercel.app,http://localhost:5173
   ```
5. Click **"Save Changes"**
6. Render will redeploy automatically

---

## Testing the Deployment

### Test Frontend

1. Open `https://your-project.vercel.app` in browser
2. Register a new user
3. Create a task
4. Verify it saves and persists

### Test API Directly

```bash
# Register
curl -X POST https://taskflow-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST https://taskflow-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get tasks (replace TOKEN with JWT from login response)
curl -X GET https://taskflow-backend.onrender.com/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

### Check Logs

- **Vercel**: Go to project → Deployments → Click deployment → Logs
- **Render**: Go to service → Logs
- **MongoDB**: Go to Atlas → Monitoring or Logs (for paid plans)

---

## Troubleshooting

### "Cannot connect to MongoDB"

- [ ] Verify connection string in Render environment
- [ ] Check MongoDB user credentials
- [ ] Ensure IP is whitelisted in MongoDB Atlas (allow `0.0.0.0/0` for Render)
- [ ] Check that database name exists in MongoDB Atlas

### "CORS error"

- [ ] Verify `CLIENT_ORIGIN` in Render backend includes your Vercel URL
- [ ] Make sure protocol is correct: `https://` for production
- [ ] Check browser console for actual CORS error message

### "Frontend can't connect to backend"

- [ ] Verify `VITE_API_URL` in Vercel environment variables
- [ ] Test backend health: `curl https://taskflow-backend.onrender.com/api/health`
- [ ] Check network tab in browser DevTools for actual request

### "JWT token errors"

- [ ] Ensure `JWT_SECRET` is same on both local and Render
- [ ] Check token expiration isn't too short
- [ ] Verify token is being sent in `Authorization: Bearer <token>` header

### Render service won't start

- [ ] Check Logs tab for errors
- [ ] Verify `START_COMMAND`: `cd backend && npm start`
- [ ] Check that `backend/package.json` exists and has `"start"` script
- [ ] Verify Node.js environment is set correctly

### Vercel build fails

- [ ] Check build logs in Vercel dashboard
- [ ] Verify repository has `src/`, `package.json` in root
- [ ] Ensure `VITE_API_URL` is set in environment variables
- [ ] Check that `npm run build` works locally

---

## Database Backups

### MongoDB Atlas

- Free tier: Automatic 7-day backups
- Paid tier: Configurable backup schedule
- To restore: Click cluster → Backup → Restore

---

## Performance Tips

### Backend (Render)

- Use Starter plan ($7/month) for better performance than Free
- Enable auto-scaling if using paid plan
- Monitor database indexes for slow queries

### Frontend (Vercel)

- Use Vercel Analytics to monitor performance
- Enable caching headers for static assets (default)
- Use image optimization features

---

## Costs

### Render

- **Free**: Limited concurrency, sleeps after 15 min inactivity
- **Starter**: $7/month - Always on, better performance
- **Standard**: $12/month - More resources

### Vercel

- **Hobby (Free)**: 6GB bandwidth/month, good for personal projects
- **Pro**: $20/month - Unlimited bandwidth, more features
- **Enterprise**: Custom pricing

### MongoDB Atlas

- **Free M0**: 512MB storage, good for development
- **M2**: $9/month - 2GB storage
- **M5+**: Pay-as-you-go - Larger deployments

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Update environment variables on both platforms
4. Test full workflow (register → login → create task)
5. Monitor logs for any issues
6. Consider upgrading to paid plans for production
7. Set up monitoring and alerts

For questions or issues, check Render and Vercel documentation or community forums.
