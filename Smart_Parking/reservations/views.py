from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from bson import ObjectId
from datetime import datetime
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

        # Check 1: Validate Parking Lot
        parking_lot = db.parkingLots.find_one({
            "_id": ObjectId(parking_lot_id),
            "status": "active"
        })
        if not parking_lot:
            return JsonResponse({"success": False, "error": "Invalid or inactive parking lot"}, status=400)

        # Check 2: Validate Parking Space
        space = db.parkingSpaces.find_one({
            "_id": ObjectId(space_id),
            "parkingLotId": ObjectId(parking_lot_id),
            "status": "libre"
        })
        if not space:
            return JsonResponse({"success": False, "error": "Invalid or occupied parking space"}, status=400)

        # Check 3: Validate User
        user = db.users.find_one({
            "_id": ObjectId(user_id),
            "isActive": True
        })
        if not user:
            return JsonResponse({"success": False, "error": "Invalid or inactive user"}, status=400)

        # Check 4: Validate Vehicle
        vehicle = db.vehicles.find_one({
            "_id": ObjectId(vehicle_id),
            "userId": ObjectId(user_id),
            "isVerified": True
        })
        if not vehicle:
            return JsonResponse({"success": False, "error": "Invalid or unverified vehicle"}, status=400)

        # Check 5: Validate date and slot availability (optional: you can add additional logic here)

        # Insert Reservation into Database
        reservation = {
            "userId": ObjectId(user_id),
            "parkingLotId": ObjectId(parking_lot_id),
            "spaceId": ObjectId(space_id),
            "vehicleId": ObjectId(vehicle_id),
            "dateDebut": datetime.fromisoformat(date_debut),
            "dateFin": datetime.fromisoformat(date_fin),
            "status": "active",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        result = db.reservations.insert_one(reservation)

        # Update parking space status to "occupe"
        db.parkingSpaces.update_one(
            {"_id": ObjectId(space_id)},
            {
                "$set": {
                    "status": "occupe",
                    "currentVehicle": ObjectId(vehicle_id),
                    "lastStatusChange": datetime.utcnow()
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
