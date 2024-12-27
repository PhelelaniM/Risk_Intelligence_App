from flask import Flask, jsonify
from flask_cors import CORS
import geopandas as gpd
import os
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define shapefile paths using absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LITOOL_PATH = os.path.join(BASE_DIR, 'static', 'data', 'Litool_sample.shp')
THATCH_PATH = os.path.join(BASE_DIR, 'static', 'data', 'High_Thatch_Accumulation_03_July_2024.shp')

def read_shapefile(filepath):
    try:
        logger.info(f"Reading shapefile: {filepath}")
        gdf = gpd.read_file(filepath)
        
        # Ensure the CRS is WGS84 (EPSG:4326)
        if gdf.crs is not None and gdf.crs != 'EPSG:4326':
            logger.info(f"Converting CRS from {gdf.crs} to EPSG:4326")
            gdf = gdf.to_crs('EPSG:4326')
        elif gdf.crs is None:
            logger.warning("No CRS found in shapefile, assuming EPSG:4326")
        
        logger.info(f"Shapefile columns: {gdf.columns.tolist()}")
        logger.info(f"Number of features: {len(gdf)}")
        
        # Convert to GeoJSON
        geojson_data = gdf.to_json()
        logger.info("Successfully converted to GeoJSON")
        return geojson_data
    except Exception as e:
        logger.error(f"Error reading shapefile: {str(e)}")
        return None

@app.route('/api/litool')
def get_litool_data():
    try:
        data = read_shapefile(LITOOL_PATH)
        if data:
            return data
        return jsonify({'error': 'Failed to read Litool shapefile'}), 500
    except Exception as e:
        logger.error(f"Error in get_litool_data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/thatch')
def get_thatch_data():
    try:
        data = read_shapefile(THATCH_PATH)
        if data:
            return data
        return jsonify({'error': 'Failed to read Thatch shapefile'}), 500
    except Exception as e:
        logger.error(f"Error in get_thatch_data: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)