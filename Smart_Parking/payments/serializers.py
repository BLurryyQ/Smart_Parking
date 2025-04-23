# payments/serializers.py
from rest_framework import serializers

class PaymentSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    reservationId = serializers.CharField()
    montant = serializers.FloatField()
    devise = serializers.CharField()
    status = serializers.CharField()
    dateCreation = serializers.DateTimeField()
