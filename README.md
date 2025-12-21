#### Recalibrate Website - Enterprise-Grade Health & Pain Management Platform

A comprehensive, VC-ready website for the revolutionary AI-powered health and pain management platform with comprehensive chronic pain benefits.

### 🚀 Recalibrate Overview

**Recalibrate** is the world's first AI-powered, multi-system health and pain management platform that provides:
- Comprehensive health tracking and insights
- Advanced pain management tools and strategies  
- AI-driven pattern recognition for better outcomes
- Clinical integration for collaborative care
- Evidence-based approaches to chronic pain management

## ✨ Website Features

### ✅ Modern Enterprise Design
- **VC-Ready Interface**: Professional design optimized for investor presentations
- **Responsive Excellence**: Perfect experience across mobile, tablet, and desktop
- **Accessibility Compliant**: WCAG 2.1 standards with keyboard navigation and screen reader support
- **Performance Optimized**: Fast loading with smooth professional animations

### ✅ Email Waitlist System
- **Real-time subscriber tracking**: MongoDB + JSON backup dual storage
- **Email-only signup**: Streamlined conversion-optimized form
- **Duplicate prevention**: Intelligent email validation and deduplication
- **Live subscriber count**: Real-time updates showing growth metrics

### ✅ Comprehensive Ecosystem Showcase
- **Education**: Clear breakdowns of pain and health strategies
- **Action**: Tools and practices for immediate implementation
- **Previews**: App launch updates and new course announcements
- **Connection**: Community stories and professional insights
- **Newsletter Integration**: Direct beehiiv subscription integration

### ✅ Provider & Research Platform
- **Multi-patient monitoring**: Track multiple connected patients/research subjects
- **Secure communication**: Built-in messaging and file sharing capabilities
- **Advanced analytics**: Research-grade data insights and outcome predictions

### ✅ Contact & Partnership
- **Professional contact system**: Modal-based contact with comprehensive FAQs
- **Partnership opportunities**: Healthcare systems, researchers, and investor outreach
- **Social media integration**: Complete social presence links

## 🛠 Tech Stack

- **Frontend**: React 18 + Tailwind CSS 3.x + Lucide Icons
- **Backend**: FastAPI + Python with enterprise security
- **Database**: MongoDB Atlas with JSON backup redundancy
- **Deployment**: Vercel (frontend) + Railway (backend)
- **Email Integration**: Beehiiv newsletter platform

## 📁 Project Structure

```
/app/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # Custom CSS with animations
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Tailwind CSS configuration
│   ├── public/
│   │   └── index.html     # SEO-optimized HTML with meta tags
│   ├── package.json       # Frontend dependencies
│   ├── vercel.json        # Vercel deployment configuration
│   └── .env              # Frontend environment variables
├── backend/               # FastAPI backend
│   ├── server.py          # API server with security headers
│   ├── requirements.txt   # Python dependencies
│   ├── railway.toml       # Railway deployment configuration
│   ├── waitlist.json      # Email storage backup
│   └── .env              # Backend environment variables
└── PRODUCTION_DEPLOYMENT_GUIDE.md  # Complete deployment guide
```

## 🚦 Development Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- Yarn package manager
- MongoDB Atlas account

### Local Development

1. **Install Frontend Dependencies**
   ```bash
   cd /app/frontend
   yarn install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd /app/backend
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   - Frontend: Set `REACT_APP_BACKEND_URL` in `/app/frontend/.env`
   - Backend: Set `MONGO_URL` in `/app/backend/.env`

4. **Start Development Servers**
   ```bash
   # Backend (port 8001)
   cd /app/backend && python server.py
   
   # Frontend (port 3000)
   cd /app/frontend && yarn start
   ```

## 🌐 Production Deployment

### Current Production Stack
- **Frontend**: Vercel → `www.recalibratepain.com`
- **Backend**: Railway → `recalibratepain-waitlist-production.up.railway.app`  
- **Database**: MongoDB Atlas → `recalibrate-waitlinglist`

### Deployment Configuration
- **Vercel**: Configured with security headers and optimized build
- **Railway**: Enterprise security with CORS protection
- **MongoDB**: Dual storage system with JSON backup redundancy

## 📡 API Endpoints

- `GET /api/health` - Comprehensive health check with storage status
- `GET /api/waitlist/count` - Real-time subscriber count
- `POST /api/waitlist/join` - Email waitlist signup
- `GET /api/waitlist/export` - Admin data export
- `GET /api/waitlist/stats` - Detailed analytics

## 🔒 Enterprise Security

### Backend Security
- **Input validation**: Comprehensive sanitization and validation
- **CORS protection**: Specific domain allowlists (no wildcards)
- **Security headers**: Complete HTTP security header implementation
- **MongoDB security**: Authenticated connections with proper access controls

### Frontend Security  
- **XSS protection**: Input sanitization and secure rendering
- **CSP headers**: Content Security Policy implementation
- **Secure links**: All external links use `rel="noopener noreferrer"`
- **Error boundaries**: Graceful error handling with user-friendly fallbacks

## 📱 Mobile Excellence

- **Mobile-first design**: Responsive grid system optimized for all devices
- **2-column layout**: Feature cards maintain 2-column layout on mobile
- **Touch optimization**: 44px minimum touch targets for accessibility
- **Performance**: Optimized animations and reduced motion support

## 📈 Analytics & Monitoring

- **Real-time metrics**: Live subscriber count with MongoDB Atlas integration
- **Dual storage**: MongoDB primary with JSON backup for redundancy
- **Growth tracking**: Historical signup data with timestamp tracking
- **Performance monitoring**: Health check endpoints for uptime verification

## 🎯 VC-Ready Features

- **Professional branding**: Clean, modern design optimizing for investor presentations
- **Growth indicators**: Live subscriber metrics demonstrating platform traction
- **Comprehensive platform**: Showcases full ecosystem from patient app to provider tools
- **Enterprise standards**: Security, accessibility, and performance optimized
- **Multi-platform launch**: iOS, Android, and web application announcements

## 🔧 Troubleshooting

### Common Issues
1. **Build Failures**: Ensure Tailwind CSS 3.x (not 4.x) for compatibility
2. **CORS Errors**: Verify backend CORS configuration includes all frontend domains
3. **MongoDB Connection**: Check Atlas connection string and network access
4. **Vercel Deployment**: Use yarn for dependencies, npm may cause conflicts

### Health Checks
- **Frontend**: `https://www.recalibratepain.com` (should load website)
- **Backend**: `https://recalibratepain-waitlist-production.up.railway.app/api/health`
- **Database**: Check MongoDB Atlas dashboard for connection status

## 📞 Support

For questions or technical issues:
- **General**: info@recalibratepain.com
- **Technical**: Check deployment logs in Vercel/Railway dashboards
- **Database**: Monitor MongoDB Atlas metrics and logs

## 📄 License

© 2025 Recalibrate. All rights reserved.

---

**Production Status**: ✅ **ENTERPRISE-READY** 
Your Recalibrate website is production-ready with comprehensive health and pain management platform showcase, optimized for VC presentations and user acquisition! 🎉
