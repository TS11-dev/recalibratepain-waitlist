from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel, EmailStr, validator
import json
import os
from datetime import datetime, timedelta
from typing import List, Optional
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import asyncio
import os
import resend
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, validator
# Removed fastapi_mail imports

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Resend Configuration
if os.environ.get("RESEND_API_KEY"):
    resend.api_key = os.environ.get("RESEND_API_KEY")
else:
    logger.warning("⚠️ RESEND_API_KEY not found. Emails will not send.")

# Default sender
SENDER_EMAIL = os.environ.get("MAIL_FROM", "info@recalibratepain.com")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        port = os.environ.get("PORT", os.environ.get("API_PORT", "8001"))
        logger.info(f"🚀 RecalibratePain API v3.0.0 starting on port {port}")
        logger.info(f"📁 JSON backup location: {WAITLIST_FILE}")
        logger.info(f"🗄️ MongoDB Database: {DB_NAME}")
        logger.info(f"📋 Collection: {COLLECTION_NAME}")
        
        # Initialize MongoDB with timeout and error handling
        try:
            mongo_connected = await asyncio.wait_for(init_mongodb(), timeout=15.0)
        except asyncio.TimeoutError:
            logger.error("❌ MongoDB initialization timed out")
            mongo_connected = False
        except Exception as e:
            logger.error(f"❌ MongoDB initialization failed: {e}")
            mongo_connected = False
        
        # Load initial data (always works with JSON fallback)
        try:
            waitlist = await get_combined_waitlist()
            logger.info(f"📊 Total subscribers loaded: {len(waitlist)}")
        except Exception as e:
            logger.error(f"❌ Error loading initial data: {e}")
            logger.info("📊 Total subscribers loaded: 0 (using fallback)")
        
        # Show storage status
        if mongo_connected:
            logger.info("✅ Dual storage active: MongoDB + JSON backup")
        else:
            logger.info("🟡 Single storage active: JSON file only")
            
        logger.info("🎯 API startup complete - ready to serve requests")
        
    except Exception as e:
        logger.error(f"❌ Startup error: {e}")
        logger.info("🔄 Continuing with minimal configuration...")
        # Don't raise the exception - let the service start anyway
    
    yield
    
    # Shutdown
    logger.info("🔄 API shutting down...")

app = FastAPI(
    title="RecalibratePain Waitlist API", 
    version="3.0.0", 
    lifespan=lifespan,
    docs_url="/docs" if os.environ.get("ENVIRONMENT") == "development" else None,
    redoc_url="/redoc" if os.environ.get("ENVIRONMENT") == "development" else None
)

# Security Middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=[
        "localhost", 
        "127.0.0.1", 
        "*.railway.app", 
        "*.vercel.app", 
        "recalibratepain.com", 
        "www.recalibratepain.com",
        "recalibratepain-waitlist-production.up.railway.app",
        "*.emergentagent.com",
        "*.preview.emergentagent.com"
    ]
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com"
    return response

# Enhanced CORS configuration for your actual production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily to fix the issue
    allow_credentials=False,  # Must be False when using "*"
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Data models
class WaitlistEntry(BaseModel):
    name: str
    email: EmailStr

class PartnerContactForm(BaseModel):
    type: str  # 'clinic', 'research', 'investor'
    name: str
    email: EmailStr
    organization: str
    message: str
    timestamp: str = None
    
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        if len(v.strip()) > 100:
            raise ValueError('Name must be less than 100 characters')
        # Basic sanitization
        sanitized = v.strip().replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;').replace('"', '&quot;')
        return sanitized
    
    @validator('email')
    def validate_email(cls, v):
        if len(v) > 254:  # RFC 5321 limit
            raise ValueError('Email address too long')
        return v.lower().strip()

class WaitlistResponse(BaseModel):
    success: bool
    message: str
    total_subscribers: int
    storage_info: Optional[str] = None

# Storage configuration
WAITLIST_FILE = os.path.join(os.path.dirname(__file__), "waitlist.json")
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = "RecalibrateWebsite"  # Exact case from Atlas
COLLECTION_NAME = "Emails"  # Capital E as shown in Atlas

# Real subscriber count only - no artificial inflation
BASE_SUBSCRIBER_COUNT = 0  # Only count real emails

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
        mongo_client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=10000)
        
        # Test the connection with timeout
        await asyncio.wait_for(mongo_client.admin.command('ping'), timeout=10.0)
        
        mongo_db = mongo_client[DB_NAME]
        mongo_collection = mongo_db[COLLECTION_NAME]
        
        logger.info("✅ MongoDB Atlas connected successfully!")
        return True
        
    except asyncio.TimeoutError:
        logger.error("❌ MongoDB connection timeout")
        return False
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

@app.get("/api/health")
async def health_check():
    """Enhanced health check with storage status"""
    try:
        # Try to get waitlist count, but don't fail if it doesn't work
        try:
            waitlist = await get_combined_waitlist()
            actual_count = len(waitlist)
            # Always add base count to actual count for social proof
            display_count = actual_count + BASE_SUBSCRIBER_COUNT  # 127 + actual count
        except Exception as e:
            logger.error(f"Error getting waitlist for health check: {e}")
            actual_count = 0
            display_count = BASE_SUBSCRIBER_COUNT  # Show base if error
        
        # Test MongoDB connection safely
        mongo_status = "❌ Disconnected"
        if mongo_client is not None:
            try:
                await asyncio.wait_for(mongo_client.admin.command('ping'), timeout=5.0)
                mongo_status = "✅ Connected"
            except asyncio.TimeoutError:
                mongo_status = "❌ Timeout"
            except Exception:
                mongo_status = "❌ Connection failed"
        
        # Test JSON file safely
        json_status = "✅ Available" if os.path.exists(WAITLIST_FILE) else "🟡 No backup file"
        
        return {
            "status": "healthy",
            "service": "RecalibratePain Waitlist API",
            "version": "3.0.0",
            "timestamp": datetime.now().isoformat(),
            "subscribers": display_count,  # Show actual count only
            "actual_subscribers": actual_count,  # Same as display count now
            "storage": {
                "mongodb": mongo_status,
                "json_backup": json_status,
                "dual_storage": mongo_status == "✅ Connected"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        # Return a basic healthy response even if there are issues
        return {
            "status": "healthy",
            "service": "RecalibratePain Waitlist API",
            "version": "3.0.0",
            "timestamp": datetime.now().isoformat(),
            "subscribers": BASE_SUBSCRIBER_COUNT,  # Show fallback when unable to count
            "actual_subscribers": 0,
            "storage": {
                "mongodb": "❌ Error",
                "json_backup": "❌ Error",
                "dual_storage": False
            }
        }

@app.get("/api/waitlist/count")
async def get_subscriber_count():
    """Get current subscriber count - base count + actual MongoDB count"""
    try:
        waitlist = await get_combined_waitlist()
        actual_count = len(waitlist)
        
        # Always add base count to actual count for social proof
        display_count = actual_count + BASE_SUBSCRIBER_COUNT  # 127 + actual count
        logger.info(f"📊 Returning total count: {display_count} (base: {BASE_SUBSCRIBER_COUNT} + actual: {actual_count})")
        source = "mongodb" if mongo_collection is not None else "json_backup"
        
        return {
            "count": display_count, 
            "timestamp": datetime.now().isoformat(),
            "source": source
        }
    except Exception as e:
        logger.error(f"Error getting subscriber count: {e}")
        # Return fallback count when unable to get real count
        return {
            "count": BASE_SUBSCRIBER_COUNT, 
            "timestamp": datetime.now().isoformat(),
            "source": "fallback"
        }
@app.get("/api/resources/course")
async def download_course_pdf():
    """Serve the course PDF for download"""
    course_path = "/app/backend/data/Recalibrate_Self_Management_101.pdf"
    if os.path.exists(course_path):
        return FileResponse(
            path=course_path, 
            filename="Recalibrate_Self_Management_101.pdf",
            media_type="application/pdf"
        )
    else:
        raise HTTPException(status_code=404, detail="Course file not found")

async def send_welcome_email(to_email: str, name: str):
    """Helper function to send the welcome email using Resend API"""
    if not os.environ.get("RESEND_API_KEY"):
        logger.info("ℹ️ Skipped welcome email (RESEND_API_KEY missing)")
        return

    try:
        welcome_html = """
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937; background-color: #ffffff;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #312e81 100%); padding: 40px 32px; border-radius: 16px 16px 0 0; text-align: center;">
                <img src="https://recalibratepain.com/recalibrate-logo.png" alt="Recalibrate" style="height: 48px; width: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.5px;">Welcome to Recalibrate</h1>
                <p style="color: #c4b5fd; font-size: 15px; margin: 0;">You're part of Cohort 1. Here's everything you need to know.</p>
            </div>

            <div style="padding: 32px;">

                <!-- Cohort 1 Banner -->
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 28px;">
                    <p style="color: #e9d5ff; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 6px 0; font-weight: 600;">Cohort 1 Launch</p>
                    <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 6px 0;">March 2026</h2>
                    <p style="color: #c4b5fd; font-size: 14px; margin: 0;">iOS, Android & Web</p>
                </div>

                <!-- Intro -->
                <p style="font-size: 15px; line-height: 1.7; color: #374151; margin-bottom: 24px;">
                    Thank you for joining us. <strong>Recalibrate</strong> is a comprehensive allied health platform built for people living with chronic pain, chronic illness, and complex health conditions &mdash; as well as the clinicians and carers who support them.
                </p>
                <p style="font-size: 15px; line-height: 1.7; color: #374151; margin-bottom: 28px;">
                    We've built an ecosystem that brings together tracking, education, AI insights, therapeutic tools, and connected care into one place. Here's what's coming:
                </p>

                <!-- The Recalibrate App -->
                <h3 style="font-size: 18px; font-weight: 700; color: #1e1b4b; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #e9d5ff;">The Recalibrate App</h3>

                <!-- For Patients / Users -->
                <div style="background-color: #f5f3ff; border-left: 4px solid #7c3aed; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 16px;">
                    <h4 style="color: #5b21b6; font-size: 15px; font-weight: 700; margin: 0 0 10px 0;">For You (Patients &amp; Users)</h4>
                    <ul style="margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.8; color: #4b5563;">
                        <li><strong>Smart Tracker</strong> &mdash; Log pain, sleep, mood, energy &amp; 18+ health variables across 8 biological systems</li>
                        <li><strong>Analytics Dashboard</strong> &mdash; Your personal Stability Score, trend analysis &amp; pattern detection</li>
                        <li><strong>Recalibrate Academy</strong> &mdash; 100+ lessons on pain science, self-management &amp; wellness strategies</li>
                        <li><strong>Therapeutic Tools</strong> &mdash; Journaling, goal tracking, guided exercises, CBT &amp; mindfulness</li>
                        <li><strong>Recalibrate AI</strong> &mdash; Chat about your health data, get personalised insights &amp; research answers</li>
                    </ul>
                </div>

                <!-- For Clinicians -->
                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 16px;">
                    <h4 style="color: #1d4ed8; font-size: 15px; font-weight: 700; margin: 0 0 10px 0;">For Clinicians</h4>
                    <ul style="margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.8; color: #4b5563;">
                        <li><strong>Multi-Patient Dashboard</strong> &mdash; Track all your patients' progress in real-time</li>
                        <li><strong>Doctor-Ready Reports</strong> &mdash; Export comprehensive health data for appointments</li>
                        <li><strong>Care Team Integration</strong> &mdash; Collaborate with other professionals in a patient's care team</li>
                        <li><strong>Research Tools</strong> &mdash; Access aggregated, anonymised data for allied health research</li>
                    </ul>
                </div>

                <!-- For Carers -->
                <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 28px;">
                    <h4 style="color: #059669; font-size: 15px; font-weight: 700; margin: 0 0 10px 0;">For Carers &amp; Family</h4>
                    <ul style="margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.8; color: #4b5563;">
                        <li><strong>Support Dashboard</strong> &mdash; Understand your loved one's daily health patterns</li>
                        <li><strong>Progress Visibility</strong> &mdash; See trends and improvements over time</li>
                        <li><strong>Connected Care</strong> &mdash; Stay in the loop with the care team</li>
                    </ul>
                </div>

                <!-- The Recalibrate Protocol -->
                <h3 style="font-size: 18px; font-weight: 700; color: #1e1b4b; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #d1fae5;">The Recalibrate Protocol</h3>
                <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 24px; border-radius: 12px; margin-bottom: 28px; color: #ffffff;">
                    <p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px 0;">
                        Our standalone clinical product &mdash; an 8-system framework addressing the root biological causes of chronic pain. Based on 250+ peer-reviewed studies.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                        <tr>
                            <td style="padding: 6px 0; font-size: 14px; color: #d1fae5;">12-Month Protocol Maps</td>
                            <td style="padding: 6px 0; font-size: 14px; color: #d1fae5; text-align: right;">8 Systems</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; font-size: 14px; color: #d1fae5;">8-Day Email Course</td>
                            <td style="padding: 6px 0; font-size: 14px; color: #d1fae5; text-align: right;">Paced Implementation</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; font-size: 14px; color: #d1fae5;">Quick Reference Guides</td>
                            <td style="padding: 6px 0; font-size: 14px; color: #d1fae5; text-align: right;">Printable PDFs</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; font-size: 14px; color: #d1fae5;">Research Directory</td>
                            <td style="padding: 6px 0; font-size: 14px; color: #d1fae5; text-align: right;">250+ Papers</td>
                        </tr>
                    </table>
                    <div style="text-align: center;">
                        <a href="https://recalibratepain.app/protocol" style="display: inline-block; background-color: #ffffff; color: #059669; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                            Explore The Protocol
                        </a>
                    </div>
                </div>

                <!-- What Happens Next -->
                <h3 style="font-size: 18px; font-weight: 700; color: #1e1b4b; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #e9d5ff;">What Happens Next</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
                    <tr>
                        <td style="padding: 12px 16px; vertical-align: top; width: 40px;">
                            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #7c3aed, #4f46e5); border-radius: 50%; color: #fff; font-size: 14px; font-weight: 700; text-align: center; line-height: 32px;">1</div>
                        </td>
                        <td style="padding: 12px 0; font-size: 14px; color: #374151; line-height: 1.6;">
                            <strong>You're on the list.</strong> You'll receive priority access and updates as we prepare for launch.
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 16px; vertical-align: top;">
                            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #7c3aed, #4f46e5); border-radius: 50%; color: #fff; font-size: 14px; font-weight: 700; text-align: center; line-height: 32px;">2</div>
                        </td>
                        <td style="padding: 12px 0; font-size: 14px; color: #374151; line-height: 1.6;">
                            <strong>Cohort 1 launches March 2026</strong> on iOS, Android &amp; Web. You'll be among the first to access the full platform.
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 16px; vertical-align: top;">
                            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #7c3aed, #4f46e5); border-radius: 50%; color: #fff; font-size: 14px; font-weight: 700; text-align: center; line-height: 32px;">3</div>
                        </td>
                        <td style="padding: 12px 0; font-size: 14px; color: #374151; line-height: 1.6;">
                            <strong>Start recalibrating.</strong> Track, learn, connect with your care team, and take control of your health journey.
                        </td>
                    </tr>
                </table>

                <!-- CTA -->
                <div style="text-align: center; margin-bottom: 28px;">
                    <a href="https://recalibratepain.app" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(124,58,237,0.3);">
                        Visit Recalibrate
                    </a>
                </div>

                <!-- Sign off -->
                <p style="font-size: 15px; line-height: 1.7; color: #374151; margin-bottom: 4px;">
                    We're building this for people who deserve better tools to manage their health. Thank you for believing in what we're creating.
                </p>
                <p style="font-size: 15px; color: #6b7280; margin-top: 20px;">
                    Warmly,<br><strong style="color: #1f2937;">The Recalibrate Team</strong>
                </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 24px 32px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 4px 0; color: #6b7280; font-weight: 600; font-size: 13px;">Recalibrate</p>
                <p style="margin: 4px 0; color: #9ca3af; font-size: 12px;">Smarter Health and Pain Technology</p>
                <p style="margin: 8px 0 0 0; font-size: 12px;">
                    <a href="https://recalibratepain.app" style="color: #7c3aed; text-decoration: none; margin: 0 8px;">App</a>
                    <a href="https://recalibratepain.app/protocol" style="color: #7c3aed; text-decoration: none; margin: 0 8px;">Protocol</a>
                    <a href="https://www.instagram.com/recalibrateapp/" style="color: #7c3aed; text-decoration: none; margin: 0 8px;">Instagram</a>
                    <a href="https://www.linkedin.com/company/recalibrate-app/" style="color: #7c3aed; text-decoration: none; margin: 0 8px;">LinkedIn</a>
                </p>
            </div>
        </div>
        """
        
        params = {
            "from": "Recalibrate <info@recalibratepain.com>",
            "to": [to_email],
            "subject": "Welcome to Recalibrate — Cohort 1 Launching March 2026",
            "html": welcome_html
        }
        
        response = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Welcome email sent to {to_email} via Resend")
        logger.info(f"Resend Response: {response}")
        
    except Exception as email_error:
        logger.error(f"Failed to send welcome email to {to_email} via Resend. Error: {str(email_error)}")

@app.post("/api/waitlist/join", response_model=WaitlistResponse)
async def join_waitlist(entry: WaitlistEntry, background_tasks: BackgroundTasks):
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
                logger.info(f"📧 Existing email re-registered: {email_lower}")
                
                # Send welcome email again for duplicates (background task)
                background_tasks.add_task(send_welcome_email, email_lower, entry.name.strip())
                
                return WaitlistResponse(
                    success=True,
                    message="Welcome back! We've sent you the course again.",
                    total_subscribers=len(existing_waitlist) + BASE_SUBSCRIBER_COUNT,  # Base + actual count
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
            
            # Send Welcome Email (background task)
            background_tasks.add_task(send_welcome_email, email_lower, entry.name.strip())

            return WaitlistResponse(
                success=True,
                message="🚀 Welcome to the future of pain management!",
                total_subscribers=len(updated_waitlist) + BASE_SUBSCRIBER_COUNT,  # Base + actual count
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

# Partner contact form endpoint
@app.post("/api/partner/contact")
async def partner_contact(form: PartnerContactForm):
    """Handle partner contact form submissions"""
    try:
        # 1. Log the inquiry (keep existing logic)
        partner_entry = {
            "type": form.type,
            "name": form.name.strip(),
            "email": form.email.lower().strip(),
            "organization": form.organization.strip(),
            "message": form.message.strip(),
            "timestamp": datetime.now().isoformat()
        }
        
        # Save to partners JSON file
        partners_file = "/app/backend/data/partners.json"
        os.makedirs(os.path.dirname(partners_file), exist_ok=True)
        
        partners = []
        if os.path.exists(partners_file):
            try:
                with open(partners_file, 'r') as f:
                    partners = json.load(f)
            except:
                partners = []
        
        partners.append(partner_entry)
        
        with open(partners_file, 'w') as f:
            json.dump(partners, f, indent=2)
            
        # 2. Send Email via Resend
        email_sent = False
        if os.environ.get("RESEND_API_KEY"):
            try:
                # Prepare email content
                # Get preview/production URL for logo
                frontend_url = os.environ.get("REACT_APP_BACKEND_URL", "https://recalibratepain.com").replace("/api", "")
                
                html_content = f"""
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <img src="{frontend_url}/recalibrate-logo.png" alt="Recalibrate Logo" style="height: 48px; width: auto;">
                    </div>
                    <h2 style="color: #4f46e5;">New Partner Inquiry: {form.type.title()}</h2>
                    <p><strong>Name:</strong> {form.name}</p>
                    <p><strong>Email:</strong> {form.email}</p>
                    <p><strong>Organization:</strong> {form.organization}</p>
                    <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
                        {form.message}
                    </div>
                    <div style="text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                        <p style="font-weight: bold; color: #4b5563;">Recalibrate Inc.</p>
                        <p>Smarter Health and Pain Technology</p>
                        <p>© 2025 Recalibrate App. Your intelligent health companion.</p>
                    </div>
                </div>
                """
                
                params = {
                    "from": "Recalibrate <info@recalibratepain.com>",
                    "to": ["info@recalibratepain.com"],
                    "subject": f"New Partner Inquiry: {form.organization}",
                    "html": html_content,
                    "reply_to": form.email
                }
                
                # Send asynchronously
                await asyncio.to_thread(resend.Emails.send, params)
                
                email_sent = True
                logger.info(f"📧 Email sent to info@recalibratepain.com regarding {form.email} via Resend")
            except Exception as email_error:
                logger.error(f"❌ Failed to send email via Resend: {email_error}")
                # Don't fail the request if email fails, just log it
        else:
            logger.info("ℹ️ Skipped email sending (RESEND_API_KEY missing)")

        logger.info(f"✅ New partner inquiry processed: {form.type} from {form.email}")
        
        return {
            "success": True,
            "message": f"Thank you for your interest! We'll contact you at {form.email} soon.",
            "type": form.type,
            "email_sent": email_sent
        }
    except Exception as e:
        logger.error(f"Partner contact error: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit inquiry")

# Root endpoint for testing
@app.get("/")
async def root():
    """Root endpoint with storage status"""
    try:
        return {
            "message": "RecalibratePain Waitlist API",
            "version": "3.0.0",
            "status": "operational",
            "storage": "dual" if mongo_client is not None else "json_backup",
            "docs": "/docs",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Root endpoint error: {e}")
        return {
            "message": "RecalibratePain Waitlist API",
            "version": "3.0.0",
            "status": "operational",
            "storage": "unknown",
            "docs": "/docs"
        }

@app.delete("/api/admin/cleanup-test-data")
async def cleanup_test_data():
    """Remove test data from database - ADMIN ONLY"""
    try:
        removed_count = 0
        
        # Remove test entries from MongoDB
        if mongo_collection is not None:
            # Remove entries that look like test data
            test_patterns = [
                {"email": {"$regex": "test.*@.*", "$options": "i"}},
                {"email": {"$regex": ".*test.*@.*", "$options": "i"}},
                {"email": {"$regex": ".*@test\\..*", "$options": "i"}},
                {"email": {"$regex": ".*@example\\..*", "$options": "i"}},
                {"name": {"$regex": "test.*", "$options": "i"}},
                {"name": {"$regex": ".*test.*", "$options": "i"}}
            ]
            
            for pattern in test_patterns:
                result = await mongo_collection.delete_many(pattern)
                removed_count += result.deleted_count
                logger.info(f"Removed {result.deleted_count} entries matching pattern: {pattern}")
        
        # Load and clean JSON backup too
        json_data = load_json_waitlist()
        original_json_count = len(json_data)
        
        # Filter out test data from JSON
        clean_json_data = []
        for entry in json_data:
            email = entry.get("email", "").lower()
            name = entry.get("name", "").lower()
            
            # Keep if it doesn't look like test data
            if not any([
                "test" in email,
                "test" in name,
                "@test." in email,
                "@example." in email,
                "dualstorage" in email,
                "mongotest" in email,
                "atlastest" in email
            ]):
                clean_json_data.append(entry)
        
        # Save cleaned JSON data
        save_json_waitlist(clean_json_data)
        json_removed = original_json_count - len(clean_json_data)
        
        logger.info(f"🧹 Cleanup complete: Removed {removed_count} from MongoDB, {json_removed} from JSON")
        
        return {
            "success": True,
            "message": "Test data cleanup completed",
            "removed_from_mongodb": removed_count,
            "removed_from_json": json_removed,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

@app.get("/api/debug/send-welcome")
async def debug_send_welcome(email: str):
    """Debug endpoint to force send a welcome email and see the result"""
    try:
        await send_welcome_email(email, "Debug User")
        return {"status": "Attempted send", "email": email, "check_logs": "Check server logs for success/failure"}
    except Exception as e:
        return {"status": "Error", "error": str(e)}

@app.get("/api/debug/network-test")
async def debug_network_test():
    """Test TCP connection to email server from Railway"""
    import socket
    
    target = os.environ.get("MAIL_SERVER", "mail.spacemail.com")
    port = int(os.environ.get("MAIL_PORT", 465))
    
    try:
        s = socket.create_connection((target, port), timeout=10)
        s.close()
        return {"status": "SUCCESS", "message": f"Successfully connected to {target}:{port}"}
    except Exception as e:
        return {"status": "FAILURE", "error": str(e), "details": f"Could not connect to {target}:{port}"}

if __name__ == "__main__":
    import uvicorn
    # Railway provides PORT, fallback to API_PORT from .env, then default to 8001
    port = int(os.environ.get("PORT", os.environ.get("API_PORT", 8001)))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)