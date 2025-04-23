from django.urls import path
from . import views

urlpatterns = [
    path('', views.parking_list, name='parking_list'),
    path('add/', views.add_parking, name='add_parking'),
    path('update/<str:id>/', views.update_parking, name='update_parking'),
    path('delete/<str:id>/', views.delete_parking, name='delete_parking'),

    path('<str:parking_id>/spaces/', views.parking_spaces_view, name='parking_spaces'),
    path('<str:parking_id>/spaces/add/', views.add_space, name='add_space'),
    path('spaces/<str:space_id>/edit/', views.edit_space, name='edit_space'),
    path('spaces/<str:space_id>/delete/', views.delete_space, name='delete_space'),
]
