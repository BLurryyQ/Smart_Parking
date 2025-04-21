from django.http import JsonResponse
from bson import ObjectId
from Smart_Parking.database import db
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta, timezone

def update_expired_reservations():
    now = datetime.now(timezone.utc)
    grace = timedelta(minutes=1)

    reservations = db['reservations']
    parking_spaces = db['parkingSpaces']

    # 1. Mark expired reservations as completed
    expired = reservations.find({
        'status': {'$in': ['active', 'pending']},
        'dateFin': {'$lte': now}
    })
    for res in expired:
        reservations.update_one(
            {'_id': res['_id']},
            {'$set': {'status': 'completed'}}
        )

    # 2. Activate eligible pending reservations
    to_activate = reservations.find({
        'status': 'pending',
        'dateDebut': {'$lte': now + grace},
        'dateFin': {'$gt': now}
    })
    for res in to_activate:
        reservations.update_one(
            {'_id': res['_id']},
            {'$set': {'status': 'active', 'updatedAt': now}}
        )

    # 3. Free up parking spaces with no active/pending reservation
    active_pending_space_ids = set(
        reservations.distinct("spaceId", {"status": {"$in": ["active", "pending"]}})
    )

    occupe_spaces = parking_spaces.find({"status": "occupe"})
    for space in occupe_spaces:
        if space["_id"] not in active_pending_space_ids:
            parking_spaces.update_one(
                {"_id": space["_id"]},
                {
                    "$set": {
                        "status": "libre",
                        "lastStatusChange": now
                    },
                    "$unset": {
                        "currentVehicle": ""
                    }
                }
            )

def to_str_id(doc):
    if not doc:
        return None
    return {key: str(value) if isinstance(value, ObjectId) else value for key, value in doc.items()}

@csrf_exempt
def get_user_reservations(request, user_id):
    try:
        update_expired_reservations()

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
            space = to_str_id(db.parkingSpaces.find_one({"_id": res["spaceId"]}))
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

