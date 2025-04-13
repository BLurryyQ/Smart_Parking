from django.urls import path
from . import views

# reservations/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('reservations/<str:reservation_id>/', views.get_reservation),
]
