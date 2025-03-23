from django.shortcuts import render, redirect
from django.contrib import messages
from Smart_Parking.database import db
from bson.objectid import ObjectId
from datetime import datetime
from django.contrib.auth.hashers import make_password  # Import Django's hashing

def staff_list(request):
    # Ensure the user is logged in
    if "user_id" not in request.session:
        return redirect("/login/")

    staff = list(db.users.find({"role": "staff"}))
    for user in staff:
        user['id'] = str(user['_id'])
        del user['_id']

    return render(request, 'staff/staff_list.html', {'staff': staff, 'segment': 'staff'})

def add_staff(request):
    if "user_id" not in request.session:
        return redirect("/login/")

    if request.method == 'POST':
        password = request.POST.get('password')

        # Hash the password using Django's make_password()
        hashed_password = make_password(password)

        user_data = {
            "email": request.POST.get('email'),
            "nom": request.POST.get('nom'),
            "prenom": request.POST.get('prenom'),
            "telephone": request.POST.get('telephone'),
            "login": request.POST.get('login'),
            "password": hashed_password,  # Store Django-hashed password
            "role": "staff",
            "isActive": True,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }

        db.users.insert_one(user_data)
        messages.success(request, "Staff member added successfully!")
        return redirect('staff_list')

    return render(request, 'staff/add_staff.html', {'segment': 'staff'})

def update_staff(request, id):
    if "user_id" not in request.session:
        return redirect("/login/")

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

        # Check if password is being updated
        new_password = request.POST.get('password')
        if new_password:
            hashed_password = make_password(new_password)  # Hash new password
            update_data["password"] = hashed_password  # Store the new hashed password

        db.users.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        messages.success(request, "Staff member updated successfully!")
        return redirect('staff_list')

    return render(request, 'staff/update_staff.html', {'staff': staff, 'segment': 'staff'})

def delete_staff(request, id):
    if "user_id" not in request.session:
        return redirect("/login/")

    if request.method == 'POST':
        result = db.users.delete_one({"_id": ObjectId(id)})
        if result.deleted_count > 0:
            messages.success(request, "Staff member deleted successfully.")
        else:
            messages.error(request, "Failed to delete staff member.")

    return redirect('staff_list')
