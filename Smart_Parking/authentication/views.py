# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from .forms import LoginForm
from Smart_Parking.database import db
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password
from datetime import datetime, timezone


def login_view(request):
    form = LoginForm(request.POST or None)
    msg = None

    if request.method == "POST":
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")

            # Fetch user from MongoDB
            user_data = db.users.find_one({"login": username})

            if user_data:
                stored_password = user_data["password"]  # Hashed password from DB

                if check_password(password, stored_password):  # Check hashed password
                    # Save user info in session
                    request.session["user_id"] = str(user_data["_id"])  # Store user ID
                    request.session["role"] = user_data["role"]  # Store role
                    request.session["username"] = user_data["login"]  # Store username

                    # Update last login timestamp
                    db.users.update_one(
                        {"_id": user_data["_id"]},
                        {"$set": {"lastLogin": datetime.now(timezone.utc)}}
                    )

                    return redirect("/")  # Redirect to home page
                else:
                    msg = "Invalid credentials"
            else:
                msg = "Invalid credentials"

    return render(request, "accounts/login.html", {"form": form, "msg": msg})

def logout_view(request):
    request.session.flush()  # Clears the session
    return redirect("/login/")  # Redirect to login page
