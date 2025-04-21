from django.urls import path
from .views import recognize_plate

urlpatterns = [
    path('', recognize_plate, name='recognize_plate'),
]
