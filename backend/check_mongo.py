import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = "RecalibrateWebsite"
COLLECTION_NAME = "Emails"

async def check_email():
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    
    email = "info@recalibratepain.com"
    print(f"Searching for {email}...")
    
    doc = await collection.find_one({"email": email})
    
    if doc:
        print("✅ FOUND in MongoDB!")
        print(doc)
    else:
        print("❌ NOT FOUND in MongoDB.")
        
    # Check total count
    count = await collection.count_documents({})
    print(f"Total documents in collection: {count}")

if __name__ == "__main__":
    asyncio.run(check_email())