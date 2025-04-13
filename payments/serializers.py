from rest_framework import serializers

class PaymentSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    reservationId = serializers.CharField()
    montant = serializers.FloatField()
    devise = serializers.CharField()
    status = serializers.CharField()
    dateCreation = serializers.DateTimeField()

    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'reservationId': str(instance.reservationId),
            'montant': instance.montant,
            'devise': instance.devise,
            'status': instance.status,
            'dateCreation': instance.dateCreation,
        }
