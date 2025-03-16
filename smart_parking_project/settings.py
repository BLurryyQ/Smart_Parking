import os
from pathlib import Path
from mongoengine import connect

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'your-secret-key'
DEBUG = True
ALLOWED_HOSTS = []

# Connexion à la base MongoDB "smart-parking"
connect(db='smart-parking', host='mongodb+srv://abdelilahberkane13:x4xPbS0OPzTafARW@smart-parking.0cmxb.mongodb.net/')

INSTALLED_APPS = [
    # On garde ces apps pour bénéficier des fonctionnalités d’authentification (même si nos modèles sont gérés par MongoEngine)
    'django.contrib.auth',
    'django.contrib.contenttypes',
    # Application REST
    'rest_framework',
    # Notre app de parking
    'parking',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'smart_parking_project.urls'
TEMPLATES = []
WSGI_APPLICATION = 'smart_parking_project.wsgi.application'

# On ne configure pas DATABASES car on utilise MongoEngine
