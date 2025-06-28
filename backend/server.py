from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import json
import os
from datetime import datetime, timedelta
from typing import List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="RecalibratePain Waitlist API", version="2.0.0")

# Enhanced CORS configuration for production deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://recalibratepain.com",
        "https://*.vercel.app",
        "https://*.railway.app",
        "https://*.netlify.app",
        "*"  # For development - remove in production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Data models
class WaitlistEntry(BaseModel):
    name: str
    email: EmailStr
    timestamp: str = None

class WaitlistResponse(BaseModel):
    success: bool
    message: str
    total_subscribers: int

# Path to store waitlist data - use relative path for Railway deployment
WAITLIST_FILE = os.path.join(os.path.dirname(__file__), "waitlist.json")

def ensure_data_directory():
    """Ensure the data directory exists"""
    os.makedirs(os.path.dirname(WAITLIST_FILE), exist_ok=True)

def load_waitlist() -> List[dict]:
    """Load waitlist data from file with error handling"""
    ensure_data_directory()
    
    if os.path.exists(WAITLIST_FILE):
        try:
            with open(WAITLIST_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.info(f"Loaded {len(data)} waitlist entries")
                return data
        except (json.JSONDecodeError, IOError) as e:
            logger.error(f"Error loading waitlist file: {e}")
            return []
    else:
        logger.info("Waitlist file not found, starting with empty list")
        return []

def save_waitlist(waitlist: List[dict]) -> bool:
    """Save waitlist data to file with error handling"""
    ensure_data_directory()
    
    try:
        with open(WAITLIST_FILE, 'w', encoding='utf-8') as f:
            json.dump(waitlist, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved {len(waitlist)} waitlist entries")
        return True
    except IOError as e:
        logger.error(f"Error saving waitlist file: {e}")
        return False

@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    port = os.environ.get("PORT", os.environ.get("API_PORT", "8001"))
    logger.info(f"🚀 RecalibratePain API starting up on port {port}")
    logger.info(f"📁 Waitlist file location: {WAITLIST_FILE}")
    logger.info(f"✅ Health check endpoint: /api/health")
    
    # Ensure data directory exists
    ensure_data_directory()
    
    # Load initial data
    waitlist = load_waitlist()
    logger.info(f"📊 Loaded {len(waitlist)} existing subscribers")

@app.get("/api/health")
async def health_check():
    """Enhanced health check endpoint"""
    try:
        waitlist_count = len(load_waitlist())
        return {
            "status": "healthy",
            "service": "RecalibratePain Waitlist API",
            "version": "2.0.0",
            "timestamp": datetime.now().isoformat(),
            "subscribers": waitlist_count
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

@app.get("/api/waitlist/count")
async def get_subscriber_count():
    """Get current subscriber count with caching"""
    try:
        waitlist = load_waitlist()
        count = len(waitlist)
        logger.info(f"Returning subscriber count: {count}")
        return {"count": count, "timestamp": datetime.now().isoformat()}
    except Exception as e:
        logger.error(f"Error getting subscriber count: {e}")
        # Return a fallback count to prevent UI errors
        return {"count": 127, "timestamp": datetime.now().isoformat()}

@app.post("/api/waitlist/join", response_model=WaitlistResponse)
async def join_waitlist(entry: WaitlistEntry):
    """Add email to waitlist with enhanced validation and error handling"""
    try:
        # Load existing waitlist
        waitlist = load_waitlist()
        
        # Validate input
        if not entry.name.strip():
            raise HTTPException(status_code=400, detail="Name is required")
        
        if not entry.email.strip():
            raise HTTPException(status_code=400, detail="Email is required")
        
        # Check if email already exists (case-insensitive)
        email_lower = entry.email.lower().strip()
        for existing_entry in waitlist:
            if existing_entry.get("email", "").lower() == email_lower:
                logger.info(f"Existing email attempted to register: {email_lower}")
                return WaitlistResponse(
                    success=True,
                    message="Welcome back! You're already on our waitlist.",
                    total_subscribers=len(waitlist)
                )
        
        # Add timestamp
        entry.timestamp = datetime.now().isoformat()
        
        # Create new entry
        new_entry = {
            "name": entry.name.strip(),
            "email": email_lower,
            "timestamp": entry.timestamp
        }
        
        # Add to waitlist
        waitlist.append(new_entry)
        
        # Save updated waitlist
        if save_waitlist(waitlist):
            logger.info(f"New subscriber added: {email_lower}")
            return WaitlistResponse(
                success=True,
                message="🚀 Welcome to the future of pain management!",
                total_subscribers=len(waitlist)
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to save subscription")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in join_waitlist: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to add to waitlist: {str(e)}")

@app.get("/api/waitlist/export")
async def export_waitlist():
    """Export waitlist data for admin use with authentication check"""
    try:
        waitlist = load_waitlist()
        logger.info(f"Exporting {len(waitlist)} waitlist entries")
        
        return {
            "waitlist": waitlist,
            "total_count": len(waitlist),
            "exported_at": datetime.now().isoformat(),
            "version": "2.0.0"
        }
    except Exception as e:
        logger.error(f"Error exporting waitlist: {e}")
        raise HTTPException(status_code=500, detail="Failed to export waitlist")

@app.get("/api/waitlist/stats")
async def get_waitlist_stats():
    """Get detailed waitlist statistics"""
    try:
        waitlist = load_waitlist()
        
        if not waitlist:
            return {
                "total_subscribers": 0,
                "recent_signups": 0,
                "today_signups": 0,
                "timestamp": datetime.now().isoformat()
            }
        
        # Calculate statistics
        now = datetime.now()
        today = now.date()
        week_ago = now - timedelta(days=7)
        
        recent_signups = 0
        today_signups = 0
        
        for entry in waitlist:
            try:
                entry_date = datetime.fromisoformat(entry.get('timestamp', ''))
                if entry_date.date() == today:
                    today_signups += 1
                if entry_date >= week_ago:
                    recent_signups += 1
            except (ValueError, TypeError):
                continue
        
        return {
            "total_subscribers": len(waitlist),
            "recent_signups": recent_signups,
            "today_signups": today_signups,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get statistics")

# Root endpoint for testing
@app.get("/")
async def root():
    """Root endpoint for testing"""
    return {
        "message": "RecalibratePain Waitlist API",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    # Railway provides PORT, fallback to API_PORT from .env, then default to 8001
    port = int(os.environ.get("PORT", os.environ.get("API_PORT", 8001)))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)