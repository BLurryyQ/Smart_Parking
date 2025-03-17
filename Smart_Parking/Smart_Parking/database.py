# Smart_Parking/database.py
from pymongo import MongoClient

# MongoDB Connection URI
MONGO_URI = "mongodb+srv://anas12:anas12@smart-parking.0cmxb.mongodb.net/smart-parking?retryWrites=true&w=majority"

# Create MongoDB Client
client = MongoClient(MONGO_URI)

# Select Database
db = client['smart-parking']
