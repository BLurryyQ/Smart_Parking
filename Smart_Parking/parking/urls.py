from django.urls import path
from .views import parking_list, add_parking, update_parking, delete_parking

urlpatterns = [
    path('', parking_list, name='parking_list'),
    path('add/', add_parking, name='add_parking'),
    path('update/<str:id>/', update_parking, name='update_parking'),
    path('delete/<str:id>/', delete_parking, name='delete_parking'),
]
