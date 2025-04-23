from django.shortcuts import render, redirect
from django.contrib import messages
from Smart_Parking.database import db
from datetime import datetime
from django.urls import reverse
from bson import ObjectId
from django.views.decorators.csrf import csrf_exempt

def parking_list(request):
    if "user_id" not in request.session:
        return redirect("/login/")

    parkings = list(db.parkingLots.find())
    for parking in parkings:
        parking['id'] = str(parking['_id'])
        del parking['_id']

    return render(request, 'parking/parking_list.html', {'parkings': parkings, 'segment': 'parking'})


def add_parking(request):
    if "user_id" not in request.session:
        return redirect("/login/")

    if request.method == 'POST':

        parking_data = {
            "owner": request.POST.get('owner'),
            "nom": request.POST.get('nom'),
            "capaciteTotal": int(request.POST.get('capaciteTotal')),
            "placeDisponibles": int(request.POST.get('placeDisponibles')),
            "status": request.POST.get('status'),
            "localisation": {
                "rue": request.POST.get('rue'),
                "ville": request.POST.get('ville'),
                "codePostal": request.POST.get('codePostal'),
                "pays": request.POST.get('pays'),
                "coordinates": [
                    float(request.POST.get('latitude')),
                    float(request.POST.get('longitude'))
                ] if request.POST.get('latitude') and request.POST.get('longitude') else []
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        db.parkingLots.insert_one(parking_data)
        messages.success(request, "Parking lot added successfully!")
        return redirect('parking_list')

    return render(request, 'parking/add_parking.html', {'segment': 'parking'})


def update_parking(request, id):
    if "user_id" not in request.session:
        return redirect("/login/")

    parking = db.parkingLots.find_one({"_id": ObjectId(id)})
    if not parking:
        messages.error(request, "Parking lot not found.")
        return redirect('parking_list')

    if request.method == 'POST':
        update_data = {
            "owner": request.POST.get('owner'),
            "nom": request.POST.get('nom'),
            "capaciteTotal": int(request.POST.get('capaciteTotal')),
            "placeDisponibles": int(request.POST.get('placeDisponibles')),
            "status": request.POST.get('status'),
            "localisation": {
                "rue": request.POST.get('rue'),
                "ville": request.POST.get('ville'),
                "codePostal": request.POST.get('codePostal'),
                "pays": request.POST.get('pays'),
                "coordinates": [
                    float(request.POST.get('latitude')),
                    float(request.POST.get('longitude'))
                ] if request.POST.get('latitude') and request.POST.get('longitude') else parking["localisation"]["coordinates"]
            },
            "updatedAt": datetime.utcnow()
        }

        db.parkingLots.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        messages.success(request, "Parking lot updated successfully!")
        return redirect('parking_list')

    parking['id'] = str(parking['_id'])
    del parking['_id']

    return render(request, 'parking/update_parking.html', {'parking': parking, 'segment': 'parking'})


def delete_parking(request, id):
    if "user_id" not in request.session:
        return redirect("/login/")

    if request.method == 'POST':
        result = db.parkingLots.delete_one({"_id": ObjectId(id)})
        if result.deleted_count > 0:
            messages.success(request, "Parking lot deleted successfully.")
        else:
            messages.error(request, "Failed to delete parking lot.")

    return redirect('parking_list')




def parking_spaces_view(request, parking_id):
    if "user_id" not in request.session:
        return redirect("/login/")

    parking = db.parkingLots.find_one({"_id": ObjectId(parking_id)})
    spaces = list(db.parkingSpaces.find({"parkingLotId": ObjectId(parking_id)}))

    for space in spaces:
        space['id'] = str(space['_id'])
        del space['_id']

    return render(request, 'parking/parking_spaces.html', {
        'parking': parking,
        'parking_id': str(parking['_id']),  # <-- Add this
        'spaces': spaces,
        'segment': 'parking'
    })

def add_space(request, parking_id):
    if request.method == "POST":
        numero = request.POST.get("numero")
        type = request.POST.get("type")
        status = request.POST.get("status")

        existing = db.parkingSpaces.find_one({"numero": numero, "parkingLotId": ObjectId(parking_id)})
        if existing:
            messages.error(request, "A space with this number already exists in this parking lot.")
            return redirect(reverse("add_space", args=[parking_id]))

        if type not in ['standard', 'handicape', 'electrique']:
            messages.error(request, "Invalid type.")
            return redirect(reverse("add_space", args=[parking_id]))

        if status not in ['libre', 'occupe', 'reserve', 'maintenance']:
            messages.error(request, "Invalid status.")
            return redirect(reverse("add_space", args=[parking_id]))

        db.parkingSpaces.insert_one({
            "numero": numero,
            "type": type,
            "status": status,
            "parkingLotId": ObjectId(parking_id),
            "currentVehicle": ObjectId("000000000000000000000000"),  # dummy objectId
            "lastStatusChange": datetime.utcnow()  # current UTC timestamp
        })

        messages.success(request, "Space added successfully!")
        return redirect(reverse("parking_spaces", args=[parking_id]))

    return render(request, "parking/add_space.html", {
        "parking_id": parking_id
    })

def edit_space(request, space_id):
    space = db.parkingSpaces.find_one({"_id": ObjectId(space_id)})
    if not space:
        messages.error(request, "Space not found.")
        return redirect("parking_list")

    if request.method == "POST":
        numero = request.POST.get("numero")
        type = request.POST.get("type")
        status = request.POST.get("status")

        existing = db.parkingSpaces.find_one({
            "numero": numero,
            "parkingLotId": space["parkingLotId"],
            "_id": {"$ne": space["_id"]}
        })
        if existing:
            messages.error(request, "A space with this number already exists in this parking lot.")
            return redirect(reverse("edit_space", args=[str(space["_id"])]))

        if type not in ['standard', 'handicape', 'electrique']:
            messages.error(request, "Invalid type.")
            return redirect(reverse("edit_space", args=[str(space["_id"])]))

        if status not in ['libre', 'occupe', 'reserve', 'maintenance']:
            messages.error(request, "Invalid status.")
            return redirect(reverse("edit_space", args=[str(space["_id"])]))

        db.parkingSpaces.update_one(
            {"_id": ObjectId(space_id)},
            {"$set": {
                "numero": numero,
                "type": type,
                "status": status
            }}
        )
        messages.success(request, "Space updated successfully!")
        return redirect(reverse("parking_spaces", args=[str(space["parkingLotId"]) ]))

    return render(request, "parking/edit_space.html", {
        "space": space
    })

@csrf_exempt
def delete_space(request, space_id):
    if request.method == "POST":
        space = db.parkingSpaces.find_one({"_id": ObjectId(space_id)})
        if not space:
            messages.error(request, "Space not found.")
            return redirect("parking_list")

        db.parkingSpaces.delete_one({"_id": ObjectId(space_id)})
        messages.success(request, "Space deleted successfully.")
        return redirect(reverse("parking_spaces", args=[str(space["parkingLotId"]) ]))

    return redirect("parking_list")
