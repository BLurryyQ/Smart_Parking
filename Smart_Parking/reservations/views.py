from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from bson import ObjectId
from datetime import datetime, timezone
from Smart_Parking.database import db

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

        # === VALIDATIONS ===

        # Check 1: Parking lot
        parking_lot = db.parkingLots.find_one({
            "_id": ObjectId(parking_lot_id),
            "status": "active"
        })
        if not parking_lot:
            return JsonResponse({"success": False, "error": "Invalid or inactive parking lot"}, status=400)

        # Check 2: Parking space
        space = db.parkingSpaces.find_one({
            "_id": ObjectId(space_id),
            "parkingLotId": ObjectId(parking_lot_id),
            "status": "libre"
        })
        if not space:
            return JsonResponse({"success": False, "error": "Invalid or occupied parking space"}, status=400)

        # Check 3: User
        user = db.users.find_one({
            "_id": ObjectId(user_id),
            "isActive": True
        })
        if not user:
            return JsonResponse({"success": False, "error": "Invalid or inactive user"}, status=400)

        # Check 4: Vehicle
        vehicle = db.vehicles.find_one({
            "_id": ObjectId(vehicle_id),
            "userId": ObjectId(user_id),
            "isVerified": True
        })
        if not vehicle:
            return JsonResponse({"success": False, "error": "Invalid or unverified vehicle"}, status=400)

        # === ALL VALIDATIONS PASSED ===

        date_debut_dt = datetime.fromisoformat(date_debut).replace(tzinfo=timezone.utc)
        date_fin_dt = datetime.fromisoformat(date_fin).replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)

        status = "pending" if date_debut_dt > now else "active"

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

        # Update parking space to 'occupe'
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