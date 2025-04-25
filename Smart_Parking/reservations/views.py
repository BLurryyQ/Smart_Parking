from dateutil import parser
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
import json
from Smart_Parking.database import db
from datetime import datetime, timezone, timedelta


@csrf_exempt
def reserve_parking_space(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    try:
        data = json.loads(request.body)

        user_id = data["userId"]
        parking_lot_id = data["parkingLotId"]
        space_id = data["spaceId"]
        vehicle_id = data["vehicleId"]
        date_debut = data["dateDebut"]
        date_fin = data["dateFin"]

        # === DATE HANDLING ===
        date_debut_dt = parser.isoparse(date_debut)
        date_fin_dt = parser.isoparse(date_fin)

        if date_debut_dt.tzinfo is None:
            date_debut_dt = date_debut_dt.replace(tzinfo=timezone.utc)
        if date_fin_dt.tzinfo is None:
            date_fin_dt = date_fin_dt.replace(tzinfo=timezone.utc)

        now = datetime.now(timezone.utc)

        # Reject if dateDebut already passed
        if date_debut_dt <= now:
            return JsonResponse({"success": False, "error": "Reservation start time is in the past"}, status=400)

        # === VALIDATIONS ===
        parking_lot = db.parkingLots.find_one({
            "_id": ObjectId(parking_lot_id),
            "status": "active"
        })
        if not parking_lot:
            return JsonResponse({"success": False, "error": "Invalid or inactive parking lot"}, status=400)

        space = db.parkingSpaces.find_one({
            "_id": ObjectId(space_id),
            "parkingLotId": ObjectId(parking_lot_id),
            "status": "libre"
        })
        if not space:
            return JsonResponse({"success": False, "error": "Invalid or occupied parking space"}, status=400)

        user = db.users.find_one({
            "_id": ObjectId(user_id),
            "isActive": True
        })
        if not user:
            return JsonResponse({"success": False, "error": "Invalid or inactive user"}, status=400)

        vehicle = db.vehicles.find_one({
            "_id": ObjectId(vehicle_id),
            "userId": ObjectId(user_id),
            "isVerified": True
        })
        if not vehicle:
            return JsonResponse({"success": False, "error": "Invalid or unverified vehicle"}, status=400)

        # === STORE RESERVATION ===
        status = "pending"
        reservation = {
            "userId": ObjectId(user_id),
            "parkingLotId": ObjectId(parking_lot_id),
            "spaceId": ObjectId(space_id),
            "vehicleId": ObjectId(vehicle_id),
            "dateDebut": date_debut_dt,
            "dateFin": date_fin_dt,
            "status": status,
            "createdAt": now,
            "updatedAt": now
        }

        result = db.reservations.insert_one(reservation)

        # Update parking space
        db.parkingSpaces.update_one(
            {"_id": ObjectId(space_id)},
            {
                "$set": {
                    "status": "occupe",
                    "currentVehicle": ObjectId(vehicle_id),
                    "lastStatusChange": now
                }
            }
        )

        # Update lastParked for the vehicle
        db.vehicles.update_one(
            {"_id": ObjectId(vehicle_id)},
            {"$set": {"lastParked": date_debut_dt}}
        )

        return JsonResponse({
            "success": True,
            "reservationId": str(result.inserted_id)
        }, status=201)

    except KeyError as e:
        return JsonResponse({"success": False, "error": f"Missing field: {str(e)}"}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)

@csrf_exempt
def cancel_reservation(request, reservation_id):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    try:
        reservation = db.reservations.find_one({"_id": ObjectId(reservation_id)})

        if not reservation:
            return JsonResponse({"success": False, "error": "Reservation not found"}, status=404)

        if reservation["status"] != "pending":
            return JsonResponse({"success": False, "error": "Only pending reservations can be cancelled"}, status=400)

        # Update the reservation status
        db.reservations.update_one(
            {"_id": ObjectId(reservation_id)},
            {
                "$set": {
                    "status": "cancelled",
                    "updatedAt": datetime.utcnow()
                }
            }
        )

        # Optionally free up the parking space
        db.parkingSpaces.update_one(
            {"_id": reservation["spaceId"]},
            {
                "$set": {
                    "status": "libre",
                    "lastStatusChange": datetime.utcnow()
                },
                "$unset": {
                    "currentVehicle": ""
                }
            }
        )

        return JsonResponse({"success": True, "message": "Reservation cancelled successfully"})

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)