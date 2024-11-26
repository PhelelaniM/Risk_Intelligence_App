# backend/app/routes.py
from flask import Blueprint, jsonify, request
from app.utils import (
    load_spatial_data,
    determine_risk_litool,
    determine_risk_thatch,
    prepare_geojson_response
)

main = Blueprint('main', __name__)

# Load spatial data at startup
litool_data, thatch_data = load_spatial_data()

@main.route('/api/risk', methods=['POST'])
def get_risk():
    """Endpoint to get risk assessment for a specific location."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        location = data.get('location')
        risk_type = data.get('riskType')
        
        if not location or not risk_type:
            return jsonify({'error': 'Missing required parameters'}), 400
            
        # Determine risk based on type
        if risk_type == 'flood':
            risk = determine_risk_litool(location, litool_data)
        else:
            risk = determine_risk_thatch(location, thatch_data)
            
        return jsonify({
            'risk': risk,
            'location': location,
            'riskType': risk_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/api/map-data/<risk_type>')
def get_map_data(risk_type):
    """Endpoint to get GeoJSON data for map visualization."""
    try:
        if risk_type not in ['flood', 'thatch']:
            return jsonify({'error': 'Invalid risk type'}), 400
            
        # Get appropriate dataset
        data = litool_data if risk_type == 'flood' else thatch_data
        
        # Prepare GeoJSON response
        response_data = prepare_geojson_response(data, risk_type)
        if response_data is None:
            return jsonify({'error': 'Error preparing map data'}), 500
            
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/api/config')
def get_config():
    """Endpoint to get map configuration."""
    try:
        from config import Config
        return jsonify({
            'defaultLocation': Config.DEFAULT_LOCATION,
            'defaultZoom': Config.DEFAULT_ZOOM
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500