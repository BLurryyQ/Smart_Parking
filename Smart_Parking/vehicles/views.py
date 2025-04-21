from rest_framework.decorators import api_view
from rest_framework.response import Response
from Smart_Parking.database import db
from bson import ObjectId
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@api_view(['GET'])
def get_user_vehicles(request, user_id):
    vehicles_collection = db['vehicles']
    vehicles = list(vehicles_collection.find({
        "userId": ObjectId(user_id),
        "isVerified": True
    }))

    # Convertir les ObjectId en chaînes pour la sérialisation JSON
    for v in vehicles:
        v['_id'] = str(v['_id'])
        v['userId'] = str(v['userId'])

    return Response(vehicles)

@csrf_exempt
def create_vehicle(request):
    if request.method != 'POST':
        return JsonResponse({"success": False, "error": "Invalid method"}, status=405)

    try:
        data = json.loads(request.body)

        required_fields = ["userId", "brand", "model", "plateNumber", "type"]
        missing_fields = [f for f in required_fields if not data.get(f)]
        if missing_fields:
            return JsonResponse({"success": False, "error": f"Missing: {', '.join(missing_fields)}"}, status=400)

        plate_number = data["plateNumber"]
        if db.vehicles.find_one({"plateNumber": plate_number}):
            return JsonResponse({"success": False, "error": "Vehicle with this plate number already exists."}, status=400)

        vehicle_data = {
            "userId": ObjectId(data["userId"]),
            "brand": data["brand"],
            "model": data["model"],
            "plateNumber": plate_number,
            "type": data["type"],
            "isVerified": True,
            "createdAt": datetime.now(),
        }

        result = db.vehicles.insert_one(vehicle_data)
        created_vehicle = db.vehicles.find_one({"_id": result.inserted_id})

        created_vehicle["_id"] = str(created_vehicle["_id"])
        created_vehicle["userId"] = str(created_vehicle["userId"])
        created_vehicle["createdAt"] = created_vehicle["createdAt"].isoformat()

        return JsonResponse({"success": True, "vehicle": created_vehicle}, status=201)

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
