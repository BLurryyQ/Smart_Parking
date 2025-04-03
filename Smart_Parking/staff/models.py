# staff/models.py

class User:
    def __init__(self, email, nom, prenom, telephone, login, password, role, is_active, last_login, created_at, updated_at, _id=None):
        self._id = _id
        self.email = email
        self.nom = nom
        self.prenom = prenom
        self.telephone = telephone
        self.login = login
        self.password = password
        self.role = role
        self.is_active = is_active
        self.last_login = last_login
        self.created_at = created_at
        self.updated_at = updated_at

    def to_dict(self):
        """Convert instance to dictionary format, suitable for MongoDB."""
        return {
            "_id": self._id,
            "email": self.email,
            "nom": self.nom,
            "prenom": self.prenom,
            "telephone": self.telephone,
            "login": self.login,
            "password": self.password,
            "role": self.role,
            "is_active": self.is_active,
            "last_login": self.last_login,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    @classmethod
    def from_dict(cls, data):
        """Create an instance of User from a dictionary."""
        return cls(
            email=data.get("email"),
            nom=data.get("nom"),
            prenom=data.get("prenom"),
            telephone=data.get("telephone"),
            login=data.get("login"),
            password=data.get("password"),
            role=data.get("role"),
            is_active=data.get("is_active"),
            last_login=data.get("last_login"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
            _id=data.get("_id", None)
        )
