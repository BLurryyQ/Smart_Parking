from django.urls import path
from . import views

urlpatterns = [
    path('user/<str:user_id>/', views.get_user_vehicles, name='get_user_vehicles'),
    path('add/', views.create_vehicle, name='create_vehicle'),
]
