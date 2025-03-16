from mongoengine import (
    Document,
    EmbeddedDocument,
    StringField,
    IntField,
    DateTimeField,
    DictField,
    ObjectIdField,
    ReferenceField,
    ListField
)
from datetime import datetime

class Localisation(EmbeddedDocument):
    rue = StringField(required=True)
    ville = StringField(required=True)
    codePostal = StringField()
    pays = StringField(required=True)
    coordinates = ListField()

class ParkingLot(Document):
    meta = {
        'collection': 'parkingLots'
    }
    owner = StringField(required=True)
    nom = StringField(required=True)
    capaciteTotal = IntField(required=True)
    placeDisponibles = IntField(required=True)
    localisation = DictField(required=True)
    status = StringField(default="actif")
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

class ParkingSpace(Document):
    meta = {
        'collection': 'parkingSpaces'
    }
    parkingLotId = ObjectIdField(required=True)
    numero = StringField(required=True)
    type = StringField(required=True, choices=["standard", "handicape", "electrique"])
    status = StringField(required=True, choices=["libre", "occupe", "reserve", "maintenance"])
    currentVehicle = ObjectIdField(null=True)
    lastStatusChange = DateTimeField(default=datetime.utcnow)
