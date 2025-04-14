from django.urls import path
from . import views

urlpatterns = [
    path('<str:reservation_id>/', views.get_reservation, name='reservations_ticket'),
]
