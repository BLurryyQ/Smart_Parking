from django.contrib.auth.hashers import check_password, make_password
from datetime import datetime, timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.timezone import now
from django.core.mail import send_mail
import json
import random
from Smart_Parking.database import db


def generate_verification_code():
    return str(random.randint(1000, 9999))


def send_verification_email(email, code):
    subject = "Verify your email address"
    message = f"Your verification code is: {code}"
    from_email = "no-reply@smartparking.com"
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)

@csrf_exempt
def verify_email_code(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get('email')
        code = data.get('code')

        if not email or not code:
            return JsonResponse({'success': False, 'error': 'Email and code are required'}, status=400)

        verification = db.verifications.find_one({'email': email, 'code': code})

        if not verification:
            return JsonResponse({'success': False, 'error': 'Invalid verification code'}, status=400)

        db.users.update_one({'email': email}, {'$set': {'isActive': True}})
        db.verifications.delete_many({'email': email})  # Optional: clean up

        return JsonResponse({'success': True}, status=200)

    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def resend_verification_code(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({'success': False, 'error': 'Email is required'}, status=400)

            user = db.users.find_one({'email': email})
            if not user:
                return JsonResponse({'success': False, 'error': 'User not found'}, status=404)

            # Generate new code
            code = generate_verification_code()

            # Save the new code
            db.verifications.insert_one({
                'userId': user['_id'],
                'email': email,
                'code': code,
                'createdAt': now()
            })

            # Resend the code via email
            send_verification_email(email, code)

            return JsonResponse({'success': True, 'message': 'Verification code resent'})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid method'}, status=405)

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
                if user_data.get("role") == "user":
                    if not user_data.get("isActive", True):
                        return JsonResponse({
                            "success": False,
                            "error": "Your account is not active."
                        }, status=403)

                    db.users.update_one(
                        {"_id": user_data["_id"]},
                        {"$set": {"lastLogin": datetime.now(timezone.utc)}}
                    )

                    user_data["userId"] = str(user_data["_id"])
                    del user_data["_id"]
                    del user_data["password"]

                    return JsonResponse({
                        "success": True,
                        "user": user_data
                    }, status=200)

        return JsonResponse({
            "success": False,
            "error": "Incorrect username or password"
        }, status=401)

    return JsonResponse({"error": "Invalid method"}, status=405)


@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('email')
            nom = data.get('nom')
            prenom = data.get('prenom')
            telephone = data.get('telephone')
            username = data.get('username')
            password = data.get('password')

            if db.users.find_one({'login': username}):
                return JsonResponse({'success': False, 'error': 'Username already exists'}, status=409)

            hashed_password = make_password(password)

            user_data = {
                'email': email,
                'nom': nom,
                'prenom': prenom,
                'telephone': telephone,
                'login': username,
                'password': hashed_password,
                'role': 'user',
                'isActive': False,
                'lastLogin': None,
                'createdAt': now(),
                'updatedAt': now()
            }

            result = db.users.insert_one(user_data)
            user_id = result.inserted_id

            code = generate_verification_code()
            db.verifications.insert_one({
                'userId': user_id,
                'email': email,
                'code': code,
                'createdAt': now()
            })

            send_verification_email(email, code)

            return JsonResponse({'success': True, 'userId': str(user_id)}, status=201)

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid method'}, status=405)
