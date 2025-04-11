from django.urls import path
from . import views

urlpatterns = [
    path('reserve/', views.reserve_parking_space, name='reserve_parking_space'),
]
