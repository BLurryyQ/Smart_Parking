from Smart_Parking.database import db
from datetime import datetime

# Parking Lot Model using PyMongo
class ParkingLot:
    @staticmethod
    def create(owner, nom, capaciteTotal, placeDisponibles, localisation):
        data = {
            "owner": owner,
            "nom": nom,
            "capaciteTotal": capaciteTotal,
            "placeDisponibles": placeDisponibles,
            "localisation": localisation,
            "status": "active",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        result = db.parkingLots.insert_one(data)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        return list(db.parkingLots.find())

    @staticmethod
    def get_by_id(lot_id):
        return db.parkingLots.find_one({"_id": lot_id})

    @staticmethod
    def update(lot_id, update_data):
        update_data["updatedAt"] = datetime.utcnow()
        db.parkingLots.update_one({"_id": lot_id}, {"$set": update_data})

    @staticmethod
    def delete(lot_id):
        db.parkingLots.delete_one({"_id": lot_id})

# Parking Space Model using PyMongo
class ParkingSpace:
    @staticmethod
    def create(parkingLotId, numero, type, status, currentVehicle=None):
        data = {
            "parkingLotId": parkingLotId,
            "numero": numero,
            "type": type,
            "status": status,
            "currentVehicle": currentVehicle,
            "lastStatusChange": datetime.utcnow()
        }
        result = db.parkingSpaces.insert_one(data)
        return str(result.inserted_id)

    @staticmethod
    def get_by_parking_lot(parkingLotId):
        return list(db.parkingSpaces.find({"parkingLotId": parkingLotId}))

    @staticmethod
    def update(space_id, update_data):
        update_data["lastStatusChange"] = datetime.utcnow()
        db.parkingSpaces.update_one({"_id": space_id}, {"$set": update_data})

    @staticmethod
    def delete(space_id):
        db.parkingSpaces.delete_one({"_id": space_id})
