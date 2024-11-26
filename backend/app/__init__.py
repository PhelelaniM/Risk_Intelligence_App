# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    
    # Enable CORS for frontend integration
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],  # React development server
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Load configuration
    app.config.from_object(Config)
    
    # Import and register blueprints
    from app.routes import main as main_blueprint
    app.register_blueprint(main_blueprint)
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200
    
    return app

# Create the application instance
app = create_app()