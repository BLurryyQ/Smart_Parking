from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
from Smart_Parking.database import db
from .models import ParkingSpace


@csrf_exempt
def get_spaces_by_parking_lot(request, parking_lot_id):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid HTTP method"}, status=405)

    try:
        spaces_cursor = db.parkingSpaces.find({"parkingLotId": ObjectId(parking_lot_id)})

        spaces = [ParkingSpace(space).to_dict() for space in spaces_cursor]

        return JsonResponse(spaces, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
