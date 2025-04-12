from django.urls import path
from . import views

urlpatterns = [
    path('user-reservations/<str:user_id>/', views.get_user_reservations, name='user_reservations'),
]
