from django.http import JsonResponse
from bson import ObjectId
from Smart_Parking.database import db
from django.views.decorators.csrf import csrf_exempt

def to_str_id(doc):
    if not doc:
        return None
    return {key: str(value) if isinstance(value, ObjectId) else value for key, value in doc.items()}

@csrf_exempt
def get_user_reservations(request, user_id):
    try:
        reservations_cursor = db.reservations.find({"userId": ObjectId(user_id)})
        reservations = []

        for res in reservations_cursor:
            reservation = {
                "_id": str(res["_id"]),
                "userId": str(res["userId"]),
                "dateDebut": str(res["dateDebut"]),
                "dateFin": str(res["dateFin"]),
                "status": res.get("status"),
                "createdAt": str(res.get("createdAt")),
                "updatedAt": str(res.get("updatedAt")),
            }

            # Include related objects with converted IDs
            parking_lot = to_str_id(db.parkingLots.find_one({"_id": res["parkingLotId"]}))
            space = to_str_id(db.spaces.find_one({"_id": res["spaceId"]}))
            vehicle = to_str_id(db.vehicles.find_one({"_id": res["vehicleId"]}))

            if parking_lot:
                reservation["parkingLot"] = parking_lot
            if space:
                reservation["space"] = space
            if vehicle:
                reservation["vehicle"] = vehicle

            reservations.append(reservation)

        return JsonResponse({"success": True, "reservations": reservations}, safe=False)

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
