from datetime import datetime

from django.http import JsonResponse
from bson import ObjectId
from Parking_lots.database import db


def convert_mongo_doc(doc):
    """Convert ObjectId & datetime to JSON-serializable format."""
    result = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            result[k] = str(v)
        elif isinstance(v, datetime):
            result[k] = v.isoformat()
        else:
            result[k] = v
    return result


def get_parking_lot(request, parking_lot_id):
    """GET /api/parking_lots/<parking_lot_id>/"""
    parking_lots_col = db["parkingLots"]

    # Find the parking lot by its ObjectId
    lot = parking_lots_col.find_one({"_id": ObjectId(parking_lot_id)})

    if not lot:
        return JsonResponse({"error": "Parking Lot not found"}, status=404)

    # Convert the MongoDB document to a serializable format
    parking_lot_data = convert_mongo_doc(lot)

    return JsonResponse(parking_lot_data)
