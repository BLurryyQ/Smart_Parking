from django.urls import path
from . import views

urlpatterns = [
    path('<str:parking_lot_id>/', views.get_parking_lot, name='get-parking-lot'),
    path('', views.get_all_parking_lots, name='get_all_parking_lots'),
]
