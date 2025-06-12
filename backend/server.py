from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import json
import os
from datetime import datetime
from typing import List

app = FastAPI(title="RecalibratePain Waitlist API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://recalibratepain.com", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
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

# Path to store waitlist data
WAITLIST_FILE = "/app/backend/waitlist.json"

def load_waitlist() -> List[dict]:
    """Load waitlist data from file"""
    if os.path.exists(WAITLIST_FILE):
        try:
            with open(WAITLIST_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_waitlist(waitlist: List[dict]):
    """Save waitlist data to file"""
    with open(WAITLIST_FILE, 'w') as f:
        json.dump(waitlist, f, indent=2)

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "RecalibratePain Waitlist API"}

@app.get("/api/waitlist/count")
async def get_subscriber_count():
    """Get current subscriber count"""
    waitlist = load_waitlist()
    return {"count": len(waitlist)}

@app.post("/api/waitlist/join", response_model=WaitlistResponse)
async def join_waitlist(entry: WaitlistEntry):
    """Add email to waitlist"""
    try:
        # Load existing waitlist
        waitlist = load_waitlist()
        
        # Check if email already exists
        for existing_entry in waitlist:
            if existing_entry.get("email", "").lower() == entry.email.lower():
                return WaitlistResponse(
                    success=True,
                    message="Welcome back! You're already on our waitlist.",
                    total_subscribers=len(waitlist)
                )
        
        # Add timestamp
        entry.timestamp = datetime.now().isoformat()
        
        # Add new entry
        waitlist.append(entry.dict())
        
        # Save updated waitlist
        save_waitlist(waitlist)
        
        return WaitlistResponse(
            success=True,
            message="🚀 Welcome to the future of pain management!",
            total_subscribers=len(waitlist)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add to waitlist: {str(e)}")

@app.get("/api/waitlist/export")
async def export_waitlist():
    """Export waitlist data (for admin use)"""
    waitlist = load_waitlist()
    return {"waitlist": waitlist, "total_count": len(waitlist)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
