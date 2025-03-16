from rest_framework import serializers
from .models import ParkingLot, ParkingSpace
from datetime import datetime

class ParkingLotSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    owner = serializers.CharField(required=True)
    nom = serializers.CharField(required=True)
    capaciteTotal = serializers.IntegerField(required=True)
    placeDisponibles = serializers.IntegerField(required=True)
    localisation = serializers.DictField(required=True)
    status = serializers.CharField(required=False)
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        lot = ParkingLot(**validated_data)
        lot.save()
        return lot

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.updatedAt = datetime.utcnow()
        instance.save()
        return instance

class ParkingSpaceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    parkingLotId = serializers.CharField(required=True)
    numero = serializers.CharField(required=True)
    type = serializers.ChoiceField(choices=["standard", "handicape", "electrique"], required=True)
    status = serializers.ChoiceField(choices=["libre", "occupe", "reserve", "maintenance"], required=True)
    currentVehicle = serializers.CharField(required=False, allow_null=True)
    lastStatusChange = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        space = ParkingSpace(**validated_data)
        space.save()
        return space

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.lastStatusChange = datetime.utcnow()
        instance.save()
        return instance
