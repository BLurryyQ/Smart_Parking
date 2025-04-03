from pymongo import MongoClient

client = MongoClient("mongodb+srv://anas12:anas12@smart-parking.0cmxb.mongodb.net/smart-parking?retryWrites=true&w=majority")
db = client['smart-parking']
