from django.urls import path, re_path, include
from home import views

urlpatterns = [
    path('', views.index, name='home'),

    path('staff/', include('staff.urls')),

    re_path(r'^.*\.html$', views.pages, name='pages'),
]
