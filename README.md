# RecalibratePain Waiting List

A comprehensive, enterprise-grade waiting list application for the revolutionary AI-powered chronic pain management platform.

## 🚀 Features

### ✅ Working Email Collection
- **Real email storage**: Names and emails saved to backend JSON file
- **Duplicate prevention**: Prevents same email from registering twice
- **Real-time subscriber count**: Updates dynamically as users join
- **Form validation**: Proper client and server-side validation

### ✅ PayPal Integration Ready
- **Popup checkout flow**: Professional PayPal SDK integration
- **Multiple donation amounts**: $10, $25, $50, $100 + custom amounts
- **Secure payments**: All transactions processed through PayPal
- **Error handling**: Graceful fallbacks when PayPal credentials not configured

### ✅ Enterprise-Level Design
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Professional UI**: Modern card-based layout with gradients and animations
- **Progress tracking**: 43% development progress with milestones
- **Social proof**: Real subscriber counts and development metrics

### ✅ Production Ready
- **Backend API**: FastAPI server with proper CORS and validation
- **Clean architecture**: Separated frontend and backend concerns
- **Environment configuration**: Ready for deployment with proper .env setup
- **Comprehensive testing**: Backend API fully tested and verified

## 🛠 Tech Stack

- **Frontend**: React 18 + Tailwind CSS + Lucide Icons
- **Backend**: FastAPI + Python
- **Payment**: PayPal SDK
- **Storage**: JSON file (easily upgradeable to database)
- **Deployment**: Vercel-ready with vercel.json configuration

## 📁 Project Structure

```
/app/
├── src/                    # React frontend source
│   ├── App.js             # Main application component
│   ├── index.js           # React entry point
│   └── index.css          # Tailwind styles
├── backend/               # FastAPI backend
│   ├── server.py          # API server
│   ├── requirements.txt   # Python dependencies
│   ├── waitlist.json      # Email storage (auto-created)
│   └── .env              # Backend environment
├── public/               # Static assets
├── package.json         # Frontend dependencies
├── vercel.json          # Deployment configuration
└── .env                 # Frontend environment
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- Yarn package manager

### Installation & Running

1. **Install Frontend Dependencies**
   ```bash
   cd /app
   yarn install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd /app/backend
   pip install -r requirements.txt
   ```

3. **Start Backend Server**
   ```bash
   cd /app/backend
   python server.py
   ```
   Backend runs on `http://localhost:8001`

4. **Start Frontend Development Server**
   ```bash
   cd /app
   yarn start
   ```
   Frontend runs on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

**Backend (/backend/.env)**
```env
ENVIRONMENT=development
API_PORT=8001
```

### PayPal Setup
1. Create PayPal Developer Account at https://developer.paypal.com
2. Create a new app and get your Client ID
3. Update `REACT_APP_PAYPAL_CLIENT_ID` in `.env`
4. For production, use live credentials

## 📡 API Endpoints

- `GET /api/health` - Health check
- `GET /api/waitlist/count` - Get subscriber count
- `POST /api/waitlist/join` - Add email to waitlist
- `GET /api/waitlist/export` - Export all waitlist data (admin)

## 🔒 Security Features

- **Email validation**: Server-side email format validation
- **CORS protection**: Properly configured for frontend communication
- **Input sanitization**: All inputs properly sanitized
- **Duplicate prevention**: Email uniqueness enforced
- **PayPal security**: All payments processed through PayPal's secure platform

## 📈 Data Storage

Waitlist data is stored in `/app/backend/waitlist.json`:
```json
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "timestamp": "2025-06-12T15:30:22.788569"
  }
]
```

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment
1. Build frontend: `yarn build`
2. Deploy build folder to your hosting provider
3. Deploy backend to Python hosting service
4. Update environment variables for production URLs

## 🧪 Testing

Backend API tested with:
- ✅ Health check endpoint
- ✅ Email collection and validation
- ✅ Duplicate email prevention
- ✅ Subscriber count accuracy
- ✅ Data persistence
- ✅ CORS configuration
- ✅ Error handling

## 📊 Monitoring

### View Waitlist Data
Access `GET /api/waitlist/export` to download all collected emails in JSON format.

### Subscriber Count
Real-time subscriber count available at `GET /api/waitlist/count`

## 🆘 Support

For questions or issues:
- Email: tristan.siokos24@gmail.com
- Check server logs for backend issues
- Check browser console for frontend issues

## 📄 License

© 2025 Recalibrate. All rights reserved.

---

**Ready for launch!** 🎉 Your RecalibratePain waiting list is production-ready with working email collection and PayPal integration.
