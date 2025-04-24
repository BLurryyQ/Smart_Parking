from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.mobile_login, name='mobile_login'),
    path('register/', views.register_user, name='register_user'),
    path('verify-email/', views.verify_email_code, name='verify_email_code'),
    path('resend-code/', views.resend_verification_code, name='resend_verification_code'),
    path('user/<str:user_id>/', views.get_user_email, name='get_user_email'),

]
