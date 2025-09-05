# PRODUCTION DEPLOYMENT GUIDE - RECALIBRATE WEBSITE

## Overview
This guide ensures proper deployment of the Recalibrate website with:
- **Backend**: Railway (FastAPI)
- **Frontend**: Vercel (React)
- **Database**: MongoDB Atlas

## 🚀 BACKEND DEPLOYMENT (Railway)

### Environment Variables Required:
```
ENVIRONMENT=production
PORT=8001
MONGO_URL=mongodb+srv://tristansiokos24:Password456@recalibrate.blvevp8.mongodb.net/?retryWrites=true&w=majority&appName=Recalibrate
```

### Railway Configuration:
1. Deploy from `/backend` directory
2. Use `server.py` as entry point
3. Ensure all domains are added to CORS allowlist
4. Verify MongoDB connection string is correct

### CORS Configuration Check:
- ✅ localhost:3000 (development)
- ✅ *.vercel.app (Vercel frontend)
- ✅ recalibratepain.com (custom domain)
- ✅ www.recalibratepain.com (www subdomain)

## 🌐 FRONTEND DEPLOYMENT (Vercel)

### Environment Variables Required:
```
REACT_APP_BACKEND_URL=https://recalibratepain-waitlist-production.up.railway.app
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
BUILD_PATH=build
REACT_APP_SHORT_NAME=Recalibrate
REACT_APP_NAME=Recalibrate - Smart Health & Pain Management
REACT_APP_DESCRIPTION=AI-powered health and pain management platform
REACT_APP_VERSION=1.0.0
```

### Vercel Configuration:
1. Deploy from `/frontend` directory
2. Build command: `yarn build`
3. Output directory: `build`
4. Node.js version: 18.x

### Custom Domain Setup:
1. Add `recalibratepain.com` to Vercel project
2. Configure DNS records
3. Enable SSL/HTTPS
4. Set up www redirect

## 🗄️ DATABASE CONFIGURATION (MongoDB Atlas)

### Current Setup:
- **Database**: `recalibrate-waitlinglist`
- **Collection**: `Emails`
- **Connection**: Already configured in backend

### Security Checklist:
- ✅ IP whitelist configured
- ✅ Database user has minimal required permissions
- ✅ Connection string uses SSL
- ✅ Backup strategy in place

## 🔒 SECURITY CONFIGURATION

### Backend Security Headers:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Content-Security-Policy: Configured

### Frontend Security:
- ✅ Input sanitization implemented
- ✅ XSS protection in forms
- ✅ Secure external links (rel="noopener noreferrer")
- ✅ HTTPS-only in production

## 📋 PRE-DEPLOYMENT CHECKLIST

### Backend (Railway):
- [ ] Environment variables set correctly
- [ ] MongoDB connection tested
- [ ] CORS origins include Vercel domain
- [ ] Health endpoint returns 200
- [ ] API endpoints return expected data

### Frontend (Vercel):
- [ ] Environment variables set correctly
- [ ] Backend URL points to Railway deployment
- [ ] Build process completes successfully
- [ ] All external links work
- [ ] Contact modal functions properly
- [ ] Newsletter link works

### Integration Testing:
- [ ] Frontend can reach backend APIs
- [ ] Email signup works end-to-end
- [ ] Subscriber count updates correctly
- [ ] Error handling works properly
- [ ] Mobile responsiveness verified

## 🔧 TROUBLESHOOTING

### Common Issues:
1. **CORS Errors**: Ensure Vercel domain is in CORS allowlist
2. **Environment Variables**: Double-check all URLs and configurations
3. **Build Failures**: Verify Node.js version compatibility
4. **MongoDB Connection**: Test connection string independently

### Health Check Endpoints:
- Backend: `https://your-backend.railway.app/api/health`
- Frontend: `https://your-frontend.vercel.app` (should show website)

## 🎯 FINAL VERIFICATION

After deployment, verify:
1. Website loads properly on custom domain
2. Email signup functionality works
3. Newsletter button redirects correctly
4. Contact modal opens and functions
5. All responsive breakpoints work
6. Performance metrics are acceptable

## 📞 SUPPORT

For deployment issues:
- Backend issues: Check Railway logs
- Frontend issues: Check Vercel function logs  
- Database issues: Check MongoDB Atlas logs
- Domain issues: Verify DNS configuration

---

**This deployment guide ensures your enterprise-grade Recalibrate website deploys successfully across all platforms!**