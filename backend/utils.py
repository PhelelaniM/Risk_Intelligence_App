import geopandas as gpd
import json
from shapely.geometry import Point
from functools import lru_cache
from pyproj import Transformer
import os
import logging

logger = logging.getLogger(__name__)

def ensure_coordinate_match(input_lat, input_lon, target_crs='EPSG:4326'):
    """
    Ensures the input coordinates match the CRS of the risk layers.
    """
    transformer = Transformer.from_crs("EPSG:4326", target_crs, always_xy=True)
    lon, lat = transformer.transform(input_lon, input_lat)
    return lat, lon

@lru_cache(maxsize=2)
def load_shapefile(filepath):
    """Load shapefile and ensure it's in EPSG:4326."""
    try:
        logger.info(f"Attempting to load shapefile from: {filepath}")
        
        if not os.path.exists(filepath):
            logger.error(f"Shapefile not found at: {filepath}")
            return None
            
        gdf = gpd.read_file(filepath)
        logger.info(f"Successfully loaded shapefile with {len(gdf)} features")
        
        if gdf.crs is None:
            logger.error(f"Shapefile {filepath} has no CRS defined")
            return None
        
        # Convert to WGS84 if needed
        if gdf.crs != 'EPSG:4326':
            logger.info(f"Converting CRS from {gdf.crs} to EPSG:4326")
            gdf = gdf.to_crs('EPSG:4326')
        
        return gdf
    except Exception as e:
        logger.error(f"Error loading shapefile {filepath}: {str(e)}")
        return None

def determine_risk_litool(location, litool_gdf):
    """
    Determines flood risk classification for a given location using the litool layer.
    """
    try:
        logger.info(f"Determining Litool risk for location: {location}")
        point = Point(location[1], location[0])  # Create point from lon, lat
        
        if litool_gdf.crs != 'EPSG:4326':
            logger.info("Converting Litool GDF to EPSG:4326")
            litool_gdf = litool_gdf.to_crs('EPSG:4326')
            
        # Find intersecting features
        intersecting = litool_gdf[litool_gdf.intersects(point)]
        logger.info(f"Found {len(intersecting)} intersecting features")
        
        if not intersecting.empty:
            risk = intersecting.iloc[0]['RISK']
            logger.info(f"Found risk classification: {risk}")
            return {"risk": f"This location's Risk Classification is {risk}"}
                
        logger.info("No risk information found for location")
        return {"risk": "No risk information available for this location"}
    except Exception as e:
        logger.error(f"Error in determine_risk_litool: {str(e)}")
        return {"risk": "Error determining risk"}

def determine_risk_thatch(location, thatch_gdf):
    """
    Determines thatch risk classification for a given location using the thatch accumulation layer.
    """
    try:
        logger.info(f"Determining Thatch risk for location: {location}")
        point = Point(location[1], location[0])  # Create point from lon, lat
        
        if thatch_gdf.crs != 'EPSG:4326':
            logger.info("Converting Thatch GDF to EPSG:4326")
            thatch_gdf = thatch_gdf.to_crs('EPSG:4326')
            
        # Find intersecting features
        intersecting = thatch_gdf[thatch_gdf.intersects(point)]
        logger.info(f"Found {len(intersecting)} intersecting features")
        
        if not intersecting.empty:
            risk = intersecting.iloc[0]['Thatch_Ris']
            logger.info(f"Found risk classification: {risk}")
            return {"risk": f"This location's Risk Classification is {risk}"}
                
        logger.info("No thatch risk found for location")
        return {"risk": "No thatch accumulation risk at this location"}
    except Exception as e:
        logger.error(f"Error in determine_risk_thatch: {str(e)}")
        return {"risk": "Error determining thatch risk"}

def style_feature(feature, risk_field='RISK'):
    """Style features based on risk level."""
    risk_value = feature['properties'].get(risk_field, '').lower() if feature['properties'] else ''
    
    # Default style
    style = {
        'fillOpacity': 0.7,
        'weight': 1,
        'opacity': 1
    }
    
    # Risk-specific styles
    if 'high' in risk_value:
        if 'reference' in risk_value:
            style['fillColor'] = '#FF9500'  # High Risk Reference
            style['color'] = '#CC7A00'
        else:
            style['fillColor'] = '#EB360F'  # High Risk
            style['color'] = '#B82A0C'
    elif 'medium' in risk_value:
        if 'reference' in risk_value:
            style['fillColor'] = '#FFE066'  # Medium-High Risk Reference
            style['color'] = '#CCB352'
        else:
            style['fillColor'] = '#FFD782'  # Medium-High Risk
            style['color'] = '#CCA868'
    else:
        style['fillColor'] = '#AAFF00'  # Low Risk
        style['color'] = '#88CC00'
        
    return style

def get_risk_classification(lat, lon, layer_name):
    """Get risk classification for a point."""
    try:
        logger.info(f"Getting risk classification for location: ({lat}, {lon})")
        point = (float(lon), float(lat))
        
        if layer_name == 'Litool':
            filepath = os.path.join(os.path.dirname(__file__), 'static', 'data', 'Litool_sample.shp')
            gdf = load_shapefile(filepath)
            if gdf is not None:
                risk = determine_risk_litool(point, gdf)
                return risk
            
        elif layer_name == 'Thatch':
            filepath = os.path.join(os.path.dirname(__file__), 'static', 'data', 'High_Thatch_Accumulation_03_July_2024.shp')
            gdf = load_shapefile(filepath)
            if gdf is not None:
                risk = determine_risk_thatch(point, gdf)
                return risk
            
        logger.info("No risk information found for location")
        return {"risk": "No risk information available"}
            
    except Exception as e:
        logger.error(f"Error in get_risk_classification: {str(e)}")
        return {"risk": "Error determining risk"}
