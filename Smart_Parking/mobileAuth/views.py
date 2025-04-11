from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from Smart_Parking.database import db
from django.contrib.auth.hashers import check_password
from datetime import datetime, timezone
from bson import ObjectId

@csrf_exempt
def mobile_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user_data = db.users.find_one({"login": username})

        if user_data:
            stored_password = user_data["password"]

            if check_password(password, stored_password):
                if user_data["role"] == "user":
                    db.users.update_one(
                        {"_id": user_data["_id"]},
                        {"$set": {"lastLogin": datetime.now(timezone.utc)}}
                    )

                    # Convert ObjectId to string and remove password
                    user_data["userId"] = str(user_data["_id"])
                    del user_data["_id"]
                    del user_data["password"]

                    return JsonResponse({
                        "success": True,
                        "user": user_data
                    }, status=200)
                else:
                    return JsonResponse({
                        "success": False,
                        "error": "Access denied: user is not allowed."
                    }, status=403)
            else:
                return JsonResponse({
                    "success": False,
                    "error": "Invalid credentials"
                }, status=401)
        else:
            return JsonResponse({
                "success": False,
                "error": "Invalid credentials"
            }, status=401)

    return JsonResponse({"error": "Invalid method"}, status=405)
