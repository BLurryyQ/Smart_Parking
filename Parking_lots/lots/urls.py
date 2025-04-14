from django.urls import path
from . import views


urlpatterns = [
    path(
        "parking_lots/<str:parking_lot_id>/",  # The dynamic <str:parking_lot_id> will pass the ID
        views.get_parking_lot,
        name="get-parking-lot",
    ),
]
