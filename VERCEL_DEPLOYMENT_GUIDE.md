# 🚀 Complete Vercel + Railway Deployment Guide

## Current Status
✅ **Railway Backend**: Active and working!  
🔧 **Frontend**: Needs Railway URL + Vercel setup

---

## Step 1: Get Your Railway Backend URL

1. Go to your Railway dashboard
2. Click on your deployed service
3. Go to the **"Settings"** tab
4. Find the **"Domains"** section
5. Copy the Railway URL (looks like: `https://yourapp-production.up.railway.app`)

---

## Step 2: Update Frontend Configuration

You need to update the frontend `.env` file with your Railway URL:

**File:** `/app/frontend/.env`
```env
# Replace with your actual Railway URL
REACT_APP_BACKEND_URL=https://your-railway-app.railway.app
```

---

## Step 3: Vercel Deployment Options

### Option A: Connect GitHub Repository (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fixed Railway deployment + Updated for Vercel"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

3. **Set Environment Variables in Vercel:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `REACT_APP_BACKEND_URL` = `https://your-railway-app.railway.app`

### Option B: Direct Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

---

## Step 4: Custom Domain Setup (Optional)

If you want to use `recalibratepain.com`:

### Vercel (Frontend):
1. Vercel Dashboard → Domains → Add `recalibratepain.com`
2. Update DNS: `CNAME` record pointing to `cname.vercel-dns.com`

### Railway (Backend):
1. Railway Dashboard → Settings → Domains → Add `api.recalibratepain.com`
2. Update DNS: `CNAME` record pointing to Railway's provided domain

### Update Frontend .env:
```env
REACT_APP_BACKEND_URL=https://api.recalibratepain.com
```

---

## Step 5: Test Everything

After deployment, test these URLs:

### Backend (Railway):
- `https://your-railway-app.railway.app/api/health`
- `https://your-railway-app.railway.app/api/waitlist/count`

### Frontend (Vercel):
- Main site should load
- Email subscription should work
- PayPal donations should work

---

## Quick Commands

**Test backend locally:**
```bash
curl https://your-railway-app.railway.app/api/health
```

**Test frontend locally:**
```bash
cd frontend && npm start
```

---

## Need Help?

1. **Railway not working?** Check the deployment logs
2. **Vercel not deploying?** Check build logs in Vercel dashboard  
3. **CORS errors?** Make sure Railway URL is correct in frontend .env
4. **PayPal not working?** Environment variables need to be set in Vercel

What's your Railway URL? I can help you update the frontend configuration!