# reservations/urls.py



# reservations/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('reservations/user/<str:user_id>/', views.get_reservations_by_user),
]

