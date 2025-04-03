# staff/urls.py
from django.urls import path
from .views import staff_list, add_staff, update_staff, delete_staff

urlpatterns = [
    path('', staff_list, name='staff_list'),
    path('add/', add_staff, name='add_staff'),
    path('update/<str:id>/', update_staff, name='update_staff'),
    path('delete/<str:id>/', delete_staff, name='delete_staff'),
]
