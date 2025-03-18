from datetime import datetime
from bson import ObjectId

# Convert a parking lot to a dictionary for response
def serialize_parking_lot(lot):
    return {
        "id": str(lot["_id"]),
        "owner": lot["owner"],
        "nom": lot["nom"],
        "capaciteTotal": lot["capaciteTotal"],
        "placeDisponibles": lot["placeDisponibles"],
        "localisation": lot["localisation"],
        "status": lot.get("status", "active"),
        "createdAt": lot["createdAt"].isoformat(),
        "updatedAt": lot["updatedAt"].isoformat()
    }

# Convert a parking space to a dictionary for response
def serialize_parking_space(space):
    return {
        "id": str(space["_id"]),
        "parkingLotId": str(space["parkingLotId"]),
        "numero": space["numero"],
        "type": space["type"],
        "status": space["status"],
        "currentVehicle": space.get("currentVehicle"),
        "lastStatusChange": space["lastStatusChange"].isoformat()
    }
