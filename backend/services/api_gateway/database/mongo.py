import os
from motor.motor_asyncio import AsyncIOMotorClient

# Get URI from environment variables, fallback to local MongoDB instance
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Initialize async MongoDB client
client = AsyncIOMotorClient(MONGO_URI)

# Select the database
db = client.omnishield

# Export collections for easy access in routes
users_collection = db.users
threat_logs_collection = db.threat_logs
reports_collection = db.reports
api_keys_collection = db.api_keys

async def init_db():
    """
    Initialize database constraints.
    Called during FastAPI startup.
    """
    # Ensure usernames are unique
    await users_collection.create_index("username", unique=True)
    await api_keys_collection.create_index("api_key", unique=True)
    
    # Indexes for querying threat logs
    await threat_logs_collection.create_index("user_id")
    await threat_logs_collection.create_index([("timestamp", -1)])
