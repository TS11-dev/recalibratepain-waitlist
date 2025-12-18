import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = "RecalibrateWebsite"
COLLECTION_NAME = "Emails"

async def delete_info_email():
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    
    email = "info@recalibratepain.com"
    print(f"Deleting {email}...")
    
    result = await collection.delete_one({"email": email})
    
    if result.deleted_count > 0:
        print("✅ DELETED from MongoDB.")
    else:
        print("⚠️ Not found to delete.")

if __name__ == "__main__":
    asyncio.run(delete_info_email())