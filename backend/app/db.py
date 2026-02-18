from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)
db = client["smart_blog_editor"]

posts_collection = db["posts"]
users_collection = db["users"]
