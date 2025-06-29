from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import json
import os
from datetime import datetime, timedelta
from typing import List, Optional
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="RecalibratePain Waitlist API", version="3.0.0")

# Enhanced CORS configuration for production deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://recalibratepain.com",
        "https://*.vercel.app",
        "https://recalibratepain-waitlist.vercel.app",
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
    storage_info: Optional[str] = None

# Storage configuration
WAITLIST_FILE = os.path.join(os.path.dirname(__file__), "waitlist.json")
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = "recalibrate-waitlinglist"
COLLECTION_NAME = "Emails"

# MongoDB client
mongo_client = None
mongo_db = None
mongo_collection = None

async def init_mongodb():
    """Initialize MongoDB connection"""
    global mongo_client, mongo_db, mongo_collection
    
    if not MONGO_URL:
        logger.warning("🟡 MongoDB URL not provided - using JSON file storage only")
        return False
    
    try:
        logger.info("🔌 Connecting to MongoDB Atlas...")
        mongo_client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        
        # Test the connection
        await mongo_client.admin.command('ping')
        
        mongo_db = mongo_client[DB_NAME]
        mongo_collection = mongo_db[COLLECTION_NAME]
        
        logger.info("✅ MongoDB Atlas connected successfully!")
        return True
        
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected MongoDB error: {e}")
        return False

def ensure_json_directory():
    """Ensure the JSON data directory exists"""
    os.makedirs(os.path.dirname(WAITLIST_FILE), exist_ok=True)

def load_json_waitlist() -> List[dict]:
    """Load waitlist data from JSON file"""
    ensure_json_directory()
    
    if os.path.exists(WAITLIST_FILE):
        try:
            with open(WAITLIST_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.info(f"📄 Loaded {len(data)} entries from JSON file")
                return data
        except (json.JSONDecodeError, IOError) as e:
            logger.error(f"❌ Error loading JSON file: {e}")
            return []
    else:
        logger.info("📄 JSON file not found, starting with empty list")
        return []

def save_json_waitlist(waitlist: List[dict]) -> bool:
    """Save waitlist data to JSON file"""
    ensure_json_directory()
    
    try:
        with open(WAITLIST_FILE, 'w', encoding='utf-8') as f:
            json.dump(waitlist, f, indent=2, ensure_ascii=False)
        logger.info(f"✅ Saved {len(waitlist)} entries to JSON file")
        return True
    except IOError as e:
        logger.error(f"❌ Error saving JSON file: {e}")
        return False

async def load_mongo_waitlist() -> List[dict]:
    """Load waitlist data from MongoDB"""
    if mongo_collection is None:
        logger.warning("🟡 MongoDB not available, using JSON fallback")
        return []
    
    try:
        cursor = mongo_collection.find({})
        entries = []
        async for document in cursor:
            # Remove MongoDB's _id field for consistency
            document.pop('_id', None)
            entries.append(document)
        
        logger.info(f"🗄️ Loaded {len(entries)} entries from MongoDB")
        return entries
        
    except Exception as e:
        logger.error(f"❌ Error loading from MongoDB: {e}")
        return []

async def save_to_mongo(entry: dict) -> bool:
    """Save a single entry to MongoDB"""
    if mongo_collection is None:
        return False
    
    try:
        # Check if email already exists
        existing = await mongo_collection.find_one({"email": entry["email"]})
        if existing:
            logger.info(f"📧 Email {entry['email']} already exists in MongoDB")
            return True
        
        # Create a copy of entry without ObjectId issues
        clean_entry = {
            "name": entry["name"],
            "email": entry["email"],
            "timestamp": entry["timestamp"]
        }
        
        # Insert new entry
        result = await mongo_collection.insert_one(clean_entry)
        if result.inserted_id:
            logger.info(f"✅ Saved entry to MongoDB: {entry['email']}")
            return True
        else:
            logger.error("❌ Failed to insert to MongoDB")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error saving to MongoDB: {e}")
        return False

async def get_combined_waitlist() -> List[dict]:
    """Get waitlist from both MongoDB and JSON, prioritizing MongoDB"""
    
    # Try MongoDB first
    mongo_data = await load_mongo_waitlist()
    if mongo_data:
        logger.info(f"📊 Using MongoDB data: {len(mongo_data)} entries")
        return mongo_data
    
    # Fallback to JSON
    json_data = load_json_waitlist()
    logger.info(f"📊 Using JSON fallback data: {len(json_data)} entries")
    return json_data

async def save_dual_storage(entry: dict) -> tuple[bool, bool, str]:
    """Save to both MongoDB and JSON file"""
    mongo_success = await save_to_mongo(entry)
    
    # Always update JSON file
    json_data = load_json_waitlist()
    
    # Check for duplicates in JSON
    email_exists = any(existing.get("email", "").lower() == entry["email"].lower() 
                      for existing in json_data)
    
    json_success = True
    if not email_exists:
        json_data.append(entry)
        json_success = save_json_waitlist(json_data)
    
    # Determine storage status
    if mongo_success and json_success:
        storage_info = "✅ Saved to MongoDB + JSON backup"
    elif mongo_success:
        storage_info = "🟡 Saved to MongoDB (JSON backup failed)"
    elif json_success:
        storage_info = "🟡 Saved to JSON backup (MongoDB unavailable)"
    else:
        storage_info = "❌ Both storage methods failed"
    
    return mongo_success, json_success, storage_info

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    port = os.environ.get("PORT", os.environ.get("API_PORT", "8001"))
    logger.info(f"🚀 RecalibratePain API v3.0.0 starting on port {port}")
    logger.info(f"📁 JSON backup location: {WAITLIST_FILE}")
    logger.info(f"🗄️ MongoDB Database: {DB_NAME}")
    logger.info(f"📋 Collection: {COLLECTION_NAME}")
    
    # Initialize MongoDB
    mongo_connected = await init_mongodb()
    
    # Load initial data
    waitlist = await get_combined_waitlist()
    logger.info(f"📊 Total subscribers loaded: {len(waitlist)}")
    
    # Show storage status
    if mongo_connected:
        logger.info("✅ Dual storage active: MongoDB + JSON backup")
    else:
        logger.info("🟡 Single storage active: JSON file only")

@app.get("/api/health")
async def health_check():
    """Enhanced health check with storage status"""
    try:
        waitlist = await get_combined_waitlist()
        
        # Test MongoDB connection
        mongo_status = "❌ Disconnected"
        if mongo_client is not None:
            try:
                await mongo_client.admin.command('ping')
                mongo_status = "✅ Connected"
            except:
                mongo_status = "❌ Connection failed"
        
        # Test JSON file
        json_status = "✅ Available" if os.path.exists(WAITLIST_FILE) else "🟡 No backup file"
        
        return {
            "status": "healthy",
            "service": "RecalibratePain Waitlist API",
            "version": "3.0.0",
            "timestamp": datetime.now().isoformat(),
            "subscribers": len(waitlist),
            "storage": {
                "mongodb": mongo_status,
                "json_backup": json_status,
                "dual_storage": mongo_status == "✅ Connected"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

@app.get("/api/waitlist/count")
async def get_subscriber_count():
    """Get current subscriber count from dual storage"""
    try:
        waitlist = await get_combined_waitlist()
        count = len(waitlist)
        logger.info(f"📊 Returning subscriber count: {count}")
        return {
            "count": count, 
            "timestamp": datetime.now().isoformat(),
            "source": "mongodb" if mongo_collection is not None else "json_backup"
        }
    except Exception as e:
        logger.error(f"Error getting subscriber count: {e}")
        # Return fallback count
        return {
            "count": 127, 
            "timestamp": datetime.now().isoformat(),
            "source": "fallback"
        }

@app.post("/api/waitlist/join", response_model=WaitlistResponse)
async def join_waitlist(entry: WaitlistEntry):
    """Add email to waitlist with dual storage"""
    try:
        # Validate input
        if not entry.name.strip():
            raise HTTPException(status_code=400, detail="Name is required")
        
        if not entry.email.strip():
            raise HTTPException(status_code=400, detail="Email is required")
        
        # Check existing entries
        existing_waitlist = await get_combined_waitlist()
        email_lower = entry.email.lower().strip()
        
        for existing_entry in existing_waitlist:
            if existing_entry.get("email", "").lower() == email_lower:
                logger.info(f"📧 Existing email attempted to register: {email_lower}")
                return WaitlistResponse(
                    success=True,
                    message="Welcome back! You're already on our waitlist.",
                    total_subscribers=len(existing_waitlist),
                    storage_info="Already exists in database"
                )
        
        # Create new entry
        new_entry = {
            "name": entry.name.strip(),
            "email": email_lower,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save to dual storage
        mongo_success, json_success, storage_info = await save_dual_storage(new_entry)
        
        if mongo_success or json_success:
            # Get updated count
            updated_waitlist = await get_combined_waitlist()
            logger.info(f"✅ New subscriber added: {email_lower}")
            
            return WaitlistResponse(
                success=True,
                message="🚀 Welcome to the future of pain management!",
                total_subscribers=len(updated_waitlist),
                storage_info=storage_info
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
    """Export waitlist data with source information"""
    try:
        # Get data from both sources
        mongo_data = await load_mongo_waitlist()
        json_data = load_json_waitlist()
        
        # Use MongoDB as primary source
        primary_data = mongo_data if mongo_data else json_data
        
        logger.info(f"📤 Exporting {len(primary_data)} waitlist entries")
        
        return {
            "waitlist": primary_data,
            "total_count": len(primary_data),
            "exported_at": datetime.now().isoformat(),
            "version": "3.0.0",
            "storage_info": {
                "primary_source": "mongodb" if mongo_data else "json_backup",
                "mongodb_entries": len(mongo_data),
                "json_backup_entries": len(json_data),
                "dual_storage_active": bool(mongo_data and json_data)
            }
        }
    except Exception as e:
        logger.error(f"Error exporting waitlist: {e}")
        raise HTTPException(status_code=500, detail="Failed to export waitlist")

@app.get("/api/waitlist/stats")
async def get_waitlist_stats():
    """Get detailed waitlist statistics from dual storage"""
    try:
        waitlist = await get_combined_waitlist()
        
        if not waitlist:
            return {
                "total_subscribers": 0,
                "recent_signups": 0,
                "today_signups": 0,
                "timestamp": datetime.now().isoformat(),
                "storage_source": "empty"
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
            "timestamp": datetime.now().isoformat(),
            "storage_source": "mongodb" if mongo_collection is not None else "json_backup"
        }
    
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get statistics")

# Root endpoint for testing
@app.get("/")
async def root():
    """Root endpoint with storage status"""
    return {
        "message": "RecalibratePain Waitlist API",
        "version": "3.0.0",
        "status": "operational",
        "storage": "dual" if mongo_client is not None else "json_backup",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    # Railway provides PORT, fallback to API_PORT from .env, then default to 8001
    port = int(os.environ.get("PORT", os.environ.get("API_PORT", 8001)))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)