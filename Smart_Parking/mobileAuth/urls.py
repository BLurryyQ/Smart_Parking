from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.mobile_login, name='mobile_login'),
]
