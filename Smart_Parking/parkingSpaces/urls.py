from django.urls import path
from . import views

urlpatterns = [
    path('<str:parking_lot_id>/', views.get_spaces_by_parking_lot, name='get_spaces_by_parking_lot'),
]
