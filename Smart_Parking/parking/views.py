from django.shortcuts import render, redirect
from django.contrib import messages
from Smart_Parking.database import db
from bson.objectid import ObjectId
from datetime import datetime

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