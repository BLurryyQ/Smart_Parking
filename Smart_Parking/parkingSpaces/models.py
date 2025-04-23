from bson import ObjectId
import datetime

class ParkingSpace:
    def __init__(self, data):
        self.id = str(data.get('_id'))
        self.parkingLotId = str(data.get('parkingLotId'))
        self.numero = data.get('numero')
        self.type = data.get('type')
        self.status = data.get('status')
        self.lastStatusChange = data.get('lastStatusChange')
        self.currentVehicle = str(data.get('currentVehicle')) if data.get('currentVehicle') else None

    def to_dict(self):
        return {
            'id': self.id,
            'parkingLotId': self.parkingLotId,
            'numero': self.numero,
            'type': self.type,
            'status': self.status,
            'lastStatusChange': self.lastStatusChange,
            'currentVehicle': self.currentVehicle
        }
