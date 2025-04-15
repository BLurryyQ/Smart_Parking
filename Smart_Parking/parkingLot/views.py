from datetime import datetime
from django.http import JsonResponse
from bson import ObjectId
from Smart_Parking.database import db


def convert_mongo_doc(doc):
    result = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            result[k] = str(v)
        elif isinstance(v, datetime):
            result[k] = v.isoformat()
        elif isinstance(v, list):
            result[k] = [convert_mongo_doc(item) if isinstance(item, dict) else item for item in v]
        elif isinstance(v, dict):
            result[k] = convert_mongo_doc(v)
        else:
            result[k] = v
    return result

def get_parking_lot(request, parking_lot_id):
    parking_lots_col = db["parkingLots"]
    spaces_col = db["parkingSpaces"]

    # Find the parking lot by its ObjectId
    lot = parking_lots_col.find_one({"_id": ObjectId(parking_lot_id)})

    if not lot:
        return JsonResponse({"error": "Parking Lot not found"}, status=404)

    # Get parking spaces for this lot
    spaces_cursor = spaces_col.find({"parkingLotId": ObjectId(parking_lot_id)})
    spaces = [convert_mongo_doc(space) for space in spaces_cursor]

    # Convert the lot document and add spaces
    parking_lot_data = convert_mongo_doc(lot)
    parking_lot_data["spaces"] = spaces

    return JsonResponse(parking_lot_data)

def get_all_parking_lots(request):
    parking_lots_col = db["parkingLots"]
    spaces_col = db["parkingSpaces"]

    # Get all parking lots
    lots_cursor = parking_lots_col.find()
    all_parking_lots = []

    for lot in lots_cursor:
        lot_id = lot["_id"]

        # Get spaces associated with this parking lot
        spaces_cursor = spaces_col.find({"parkingLotId": lot_id})
        spaces = [convert_mongo_doc(space) for space in spaces_cursor]

        # Add spaces to lot and convert it
        lot_data = convert_mongo_doc(lot)
        lot_data["spaces"] = spaces

        all_parking_lots.append(lot_data)

    return JsonResponse(all_parking_lots, safe=False)