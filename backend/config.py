# backend/config.py
import os
from pathlib import Path

class Config:
    # Base directory of the application
    BASE_DIR = Path(__file__).parent
    
    # Data directory for shapefiles
    DATA_DIR = os.path.join(BASE_DIR, 'static', 'data')
    
    # Flask configurations
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    DEBUG = True
    
    # Default map settings
    DEFAULT_LOCATION = [-29.151591032730604, 26.188980937523347]
    DEFAULT_ZOOM = 5
    
    # CORS settings
    CORS_HEADERS = 'Content-Type'