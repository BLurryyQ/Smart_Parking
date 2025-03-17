from django.shortcuts import render, redirect
from django.contrib import messages
from Smart_Parking.database import db
from bson.objectid import ObjectId
from datetime import datetime


def staff_list(request):
    staff = list(db.users.find({"role": "staff"}))
    for user in staff:
        user['id'] = str(user['_id'])
        del user['_id']

    return render(request, 'staff/staff_list.html', {'staff': staff, 'segment': 'staff'})


def add_staff(request):
    if request.method == 'POST':
        user_data = {
            "email": request.POST.get('email'),
            "nom": request.POST.get('nom'),
            "prenom": request.POST.get('prenom'),
            "telephone": request.POST.get('telephone'),
            "login": request.POST.get('login'),
            "password": request.POST.get('password'),
            "role": "staff",
            "isActive": True,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        if 'lastLogin' in request.POST and request.POST['lastLogin']:
            user_data['lastLogin'] = datetime.strptime(request.POST['lastLogin'], '%Y-%m-%d %H:%M:%S')

        db.users.insert_one(user_data)
        return redirect('staff_list')

    return render(request, 'staff/add_staff.html', {'segment': 'staff'})


def update_staff(request, id):
    staff = db.users.find_one({"_id": ObjectId(id)})
    if not staff:
        messages.error(request, "Staff member not found.")
        return redirect('staff_list')

    if request.method == 'POST':
        update_data = {
            "email": request.POST.get('email'),
            "nom": request.POST.get('nom'),
            "prenom": request.POST.get('prenom'),
            "telephone": request.POST.get('telephone'),
            "updatedAt": datetime.now(),
        }

        db.users.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        messages.success(request, "Staff member updated successfully.")
        return redirect('staff_list')

    return render(request, 'staff/update_staff.html', {'staff': staff, 'segment': 'staff'})


def delete_staff(request, id):
    if request.method == 'POST':
        result = db.users.delete_one({"_id": ObjectId(id)})
        if result.deleted_count > 0:
            messages.success(request, "Staff member deleted successfully.")
        else:
            messages.error(request, "Failed to delete staff member.")
        return redirect('staff_list')
    else:
        return redirect('staff_list')
