# backend/app/utils.py
import geopandas as gpd
from pathlib import Path
from shapely.geometry import Point, box
from pyproj import Transformer
import os
from config import Config

def load_spatial_data():
    """Load and cache spatial data from shapefiles."""
    try:
        litool = gpd.read_file(os.path.join(Config.DATA_DIR, 'Litool_sample.shp'))
        thatch = gpd.read_file(os.path.join(Config.DATA_DIR, 'High_Thatch_Accumulation_03_July_2024.shp'))
        return litool, thatch
    except Exception as e:
        print(f"Error loading spatial data: {e}")
        return None, None

def ensure_coordinate_match(input_lat, input_lon, target_crs='EPSG:4326'):
    """Ensure coordinates match the target coordinate reference system."""
    try:
        transformer = Transformer.from_crs("EPSG:4326", target_crs, always_xy=True)
        lon, lat = transformer.transform(input_lon, input_lat)
        return lat, lon
    except Exception as e:
        print(f"Error transforming coordinates: {e}")
        return None, None

def determine_risk_litool(location, litool_data):
    """Determine risk classification for litool data."""
    try:
        lat, lon = ensure_coordinate_match(location[1], location[0], litool_data.crs)
        if lat is None or lon is None:
            return 'Error in coordinate transformation'
            
        point = Point(lon, lat)
        for idx, row in litool_data.iterrows():
            if point.intersects(row.geometry):
                return row['RISK']
        return 'No risk information'
    except Exception as e:
        print(f"Error determining litool risk: {e}")
        return 'Error in risk determination'

def determine_risk_thatch(location, thatch_data):
    """Determine risk classification for thatch accumulation."""
    try:
        lat, lon = ensure_coordinate_match(location[1], location[0], thatch_data.crs)
        if lat is None or lon is None:
            return 'Error in coordinate transformation'
            
        point = Point(lon, lat)
        for idx, row in thatch_data.iterrows():
            if point.intersects(row.geometry):
                return 'High Thatch Accumulation'
        return 'No thatch accumulation risk'
    except Exception as e:
        print(f"Error determining thatch risk: {e}")
        return 'Error in risk determination'

def prepare_geojson_response(gdf, risk_type):
    """Prepare GeoJSON response with proper styling information."""
    try:
        # Convert to GeoJSON
        geojson = gdf.to_json()
        
        # Add style information based on risk type
        if risk_type == 'flood':
            style_field = 'RISK'
        else:
            style_field = 'Thatch_Ris'
            
        return {
            'geojson': geojson,
            'style_field': style_field
        }
    except Exception as e:
        print(f"Error preparing GeoJSON: {e}")
        return None