import asyncio
import os
import json
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = "RecalibrateWebsite"
COLLECTION_NAME = "Emails"

async def sync_json_to_mongo():
    print(f"Connecting to {MONGO_URL.split('@')[1]}...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    
    # 1. Get Mongo Emails
    mongo_emails = set()
    async for doc in collection.find({}, {"email": 1}):
        mongo_emails.add(doc["email"].lower())
    
    print(f"Found {len(mongo_emails)} emails in MongoDB.")
    
    # 2. Get JSON Emails
    json_path = "/app/backend/waitlist.json"
    if not os.path.exists(json_path):
        print("No JSON file found.")
        return
        
    with open(json_path, 'r') as f:
        json_data = json.load(f)
    
    print(f"Found {len(json_data)} emails in JSON.")
    
    # 3. Sync Missing
    added = 0
    for entry in json_data:
        email = entry["email"].lower()
        if email not in mongo_emails:
            print(f"Syncing {email} to Mongo...")
            # Clean entry
            new_doc = {
                "name": entry["name"],
                "email": email,
                "timestamp": entry["timestamp"]
            }
            await collection.insert_one(new_doc)
            added += 1
            
    print(f"Sync Complete. Added {added} missing emails to MongoDB.")

if __name__ == "__main__":
    asyncio.run(sync_json_to_mongo())