from django.urls import path
from .views import ParkingLotList, ParkingLotDetail, ParkingSpaceList, ParkingSpaceDetail

urlpatterns = [
    # ParkingLot endpoints
    path('parking-lots/', ParkingLotList.as_view(), name='parking-lot-list'),
    path('parking-lots/<str:pk>/', ParkingLotDetail.as_view(), name='parking-lot-detail'),
    # ParkingSpace endpoints
    path('parking-spaces/', ParkingSpaceList.as_view(), name='parking-space-list'),
    path('parking-spaces/<str:pk>/', ParkingSpaceDetail.as_view(), name='parking-space-detail'),
]
