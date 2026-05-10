# Deployment Guide - Railway

## Prerequisites
- GitHub account with repo pushed
- Railway account ([railway.app](https://railway.app))

---

## Backend Deployment (Node.js + MongoDB Atlas)

### 1. Create MongoDB Atlas Database
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create account & free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/taskmanager`
4. Note: Keep this safe

### 2. Deploy Backend to Railway
1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your **Team-Task-Manager** repository
4. In the service settings, set **Root Directory** to `server`
5. Add environment variables:
   - `PORT` = 5000
   - `MONGO_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Generate random string (use `openssl rand -base64 32`)
   - `JWT_EXPIRES_IN` = 7d
   - `CLIENT_URL` = Your frontend URL (add later after frontend is deployed)

6. Click **Deploy**
7. Once deployed, copy the generated URL (e.g., `https://teamtask-api-prod.railway.app`)

---

## Frontend Deployment

### 1. Deploy Frontend to Railway
1. In Railway, click **Add** in your project
2. Select **GitHub Repo** again (same repo)
3. Set **Root Directory** to `client`
4. Add environment variable:
   - `VITE_API_URL` = Your backend URL (from step above)

5. Click **Deploy**
6. Once deployed, you'll get a frontend URL (e.g., `https://teamtask-ui-prod.railway.app`)

### 2. Update Backend with Frontend URL
1. Go back to backend service settings
2. Update `CLIENT_URL` environment variable with your frontend URL
3. Service should redeploy automatically

---

## Verify Deployment

1. Visit frontend URL
2. Signup/Login
3. Create a project and task
4. Check dashboard

If you get CORS errors, verify `CLIENT_URL` and `VITE_API_URL` match your deployed URLs.

---

## Manual Railway CLI Deployment (Alternative)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy backend
cd server
railway up

# Deploy frontend
cd ../client
railway up
```

---

## Troubleshooting

**Backend won't start:**
- Check MongoDB URI is correct
- Verify all env vars are set
- Check logs in Railway dashboard

**Frontend can't reach API:**
- Verify `VITE_API_URL` matches backend URL
- Check CORS settings in backend
- Rebuild frontend after env var change

**Database connection fails:**
- Whitelist Railway IP in MongoDB Atlas
- Or use IP 0.0.0.0/0 for testing
- Verify username/password in connection string
