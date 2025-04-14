from django.http import JsonResponse
from bson import ObjectId
from datetime import datetime
from Smart_Parking.database import db

def convert_mongo_doc(doc):
    if not doc:
        return None
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(value, dict):
            result[key] = convert_mongo_doc(value)
        elif isinstance(value, list):
            result[key] = [convert_mongo_doc(item) if isinstance(item, dict) else item for item in value]
        else:
            result[key] = value
    return result

def get_reservation(request, reservation_id):
    reservations = db['reservations']
    parking_lots = db['parkingLots']
    vehicles = db['vehicles']
    spaces = db['parkingSpaces']

    reservation = reservations.find_one({'_id': ObjectId(reservation_id)})

    if not reservation:
        return JsonResponse({'error': 'Reservation not found'}, status=404)

    # Fetch related data
    parking_lot = parking_lots.find_one({'_id': reservation.get('parkingLotId')})
    vehicle = vehicles.find_one({'_id': reservation.get('vehicleId')})
    space = spaces.find_one({'_id': reservation.get('spaceId')}) if reservation.get('spaceId') else None

    # Add joined info
    reservation['parkingLot'] = parking_lot
    reservation['vehicle'] = vehicle
    reservation['space'] = space

    return JsonResponse(convert_mongo_doc(reservation), safe=False)
