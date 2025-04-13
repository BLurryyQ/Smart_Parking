
from django.http import JsonResponse
from bson import ObjectId
from datetime import datetime
from E_ticket.database import db  # import the MongoDB connection

# Utility to convert MongoDB document to JSON-serializable dict
def convert_mongo_doc(doc):
    if not doc:
        return None
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        else:
            result[key] = value
    return result

# GET /api/reservations/<reservation_id>/
def get_reservation(request, reservation_id):
    reservations = db['reservations']
    reservation = reservations.find_one({'_id': ObjectId(reservation_id)})

    if not reservation:
        return JsonResponse({'error': 'Reservation not found'}, status=404)

    return JsonResponse(convert_mongo_doc(reservation), safe=False)
