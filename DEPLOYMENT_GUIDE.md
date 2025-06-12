# 🚀 RecalibratePain Deployment Guide

## Current Setup Status
✅ Frontend: Ready for Vercel  
✅ Backend: Ready for Python hosting  
✅ PayPal: Working with direct donation links  
✅ Email Collection: Working with backend API  

## Option 1: Frontend on Vercel + Backend on Railway (Recommended)

### Step 1: Deploy Backend to Railway
1. Go to [railway.app](https://railway.app) and sign up
2. Create new project → "Deploy from GitHub repo"
3. Connect your GitHub repo
4. Set root directory to `/backend`
5. Railway will auto-detect Python and install dependencies
6. Set environment variables:
   ```
   PORT=8001
   ENVIRONMENT=production
   ```
7. Your backend will be live at: `https://your-app.railway.app`

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repo
3. Set root directory to `/` (main folder)
4. Set environment variables in Vercel dashboard:
   ```
   REACT_APP_BACKEND_URL=https://your-app.railway.app
   ```
5. Deploy! Your frontend will be live at: `https://your-app.vercel.app`

### Step 3: Custom Domain (Optional)
1. In Vercel, go to your project → Settings → Domains
2. Add `recalibratepain.com`
3. Follow DNS configuration instructions

## Option 2: Full-Stack on Vercel (Advanced)

### Backend as Vercel Serverless Function
1. Create `/api` folder in root
2. Convert FastAPI routes to Vercel serverless functions
3. Move backend logic to `/api/` folder
4. Update all frontend API calls to use `/api/` prefix

*This requires significant restructuring and is more complex.*

## Option 3: Alternative Hosting

### Backend Options:
- **Railway** (recommended): Easy Python deployment
- **Render**: Free tier available
- **Heroku**: Popular but more expensive
- **DigitalOcean App Platform**: Good performance

### Frontend Options:
- **Vercel** (recommended): Automatic GitHub deploys
- **Netlify**: Alternative to Vercel
- **GitHub Pages**: Free but basic

## Environment Variables for Production

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

### Backend (.env)
```env
ENVIRONMENT=production
PORT=8001
CORS_ORIGINS=https://recalibratepain.com,https://your-app.vercel.app
```

## Database Upgrade (Future)

Currently using JSON file storage. For production scale, consider:
- **PostgreSQL** on Railway/Render
- **MongoDB Atlas** (cloud)
- **Supabase** (PostgreSQL with API)

## Monitoring & Analytics

### Email Collection Monitoring
- Access `/api/waitlist/export` to download subscriber data
- Monitor `/api/waitlist/count` for real-time counts

### PayPal Donations
- Check your PayPal account for donation notifications
- Consider PayPal IPN (Instant Payment Notification) for automation

## SSL & Security
- Both Vercel and Railway provide automatic HTTPS
- CORS is configured for cross-origin requests
- Environment variables keep sensitive data secure

## Recommended Deployment Flow

1. ✅ **Deploy Backend First** (Railway)
2. ✅ **Test Backend APIs** with Postman/curl
3. ✅ **Deploy Frontend** (Vercel) with backend URL
4. ✅ **Test Full Application** end-to-end
5. ✅ **Add Custom Domain** (optional)
6. ✅ **Monitor and Optimize**

## Cost Estimate
- **Railway Backend**: Free tier → $5/month for production
- **Vercel Frontend**: Free tier (perfect for this app)
- **Domain**: ~$10-15/year
- **Total**: ~$5-10/month for production-ready hosting

---

**Ready to deploy!** Your RecalibratePain waiting list is production-ready with working email collection and PayPal donations. 🎉