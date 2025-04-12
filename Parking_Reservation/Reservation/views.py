# reservations/views.py

from django.http import JsonResponse
from bson import ObjectId
from datetime import datetime
from Parking_Reservation.database import db

def convert_mongo_doc(doc):
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        else:
            result[key] = value
    return result

def get_reservations_by_user(request, user_id):
    reservations_collection = db['reservations']
    vehicles_collection = db['vehicles']
    lots_collection = db['parkingLots']
    spaces_collection = db['spaces']

    cursor = reservations_collection.find({'userId': ObjectId(user_id)})

    enriched_reservations = []
    for r in cursor:
        reservation = convert_mongo_doc(r)

        # Fetch related vehicle info
        vehicle = vehicles_collection.find_one({'_id': r.get('vehicleId')})
        reservation['vehicle'] = convert_mongo_doc(vehicle) if vehicle else None

        # Fetch related parking lot info
        lot = lots_collection.find_one({'_id': r.get('parkingLotId')})
        reservation['parkingLot'] = convert_mongo_doc(lot) if lot else None

        # Fetch related space info
        space = spaces_collection.find_one({'_id': r.get('spaceId')})
        reservation['space'] = convert_mongo_doc(space) if space else None

        # Optional: remove the raw IDs if you want
        # del reservation['vehicleId']
        # del reservation['parkingLotId']
        # del reservation['spaceId']

        enriched_reservations.append(reservation)

    return JsonResponse(enriched_reservations, safe=False)
