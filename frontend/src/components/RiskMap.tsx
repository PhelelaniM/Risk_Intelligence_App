import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Box } from '@mui/material';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure.css';
import AttributeTable from './AttributeTable';
import ControlPanel from './ControlPanel';
import Legend from './Legend';

// Define GeoJSON type
type GeoJsonObject = any;

const DEFAULT_CENTER: [number, number] = [-28.4793, 24.6727];
const DEFAULT_ZOOM = 6;

// Create a component to add the measure control
const MeasureControl: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const measureControl = new (L as any).Control.Measure({
      position: 'topright',
      primaryLengthUnit: 'meters',
      secondaryLengthUnit: 'kilometers',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: 'hectares',
      activeColor: '#db4a29',
      completedColor: '#9b2d14'
    });
    measureControl.addTo(map);

    return () => {
      map.removeControl(measureControl);
    };
  }, [map]);

  return null;
};

const RiskMap: React.FC = () => {
  const [litoolData, setLitoolData] = useState<GeoJsonObject | null>(null);
  const [thatchData, setThatchData] = useState<GeoJsonObject | null>(null);
  const [activeLayer, setActiveLayer] = useState<'litool' | 'thatch'>('thatch');
  const [attributeData, setAttributeData] = useState<any[]>([]);
  const [riskClassification, setRiskClassification] = useState('No risk classification available');
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    // Fetch Litool data
    axios.get('http://localhost:5000/api/litool')
      .then(response => {
        setLitoolData(response.data as GeoJsonObject);
        if (activeLayer === 'litool' && response.data.features) {
          const features = response.data.features.map((feature: any) => ({
            ...feature.properties
          }));
          setAttributeData(features);
        }
      })
      .catch(error => console.error('Error fetching Litool data:', error));

    // Fetch Thatch data
    axios.get('http://localhost:5000/api/thatch')
      .then(response => {
        setThatchData(response.data as GeoJsonObject);
        if (activeLayer === 'thatch' && response.data.features) {
          const features = response.data.features.map((feature: any) => ({
            ...feature.properties,
            geometry: feature.geometry
          }));
          setAttributeData(features);
        }
      })
      .catch(error => console.error('Error fetching Thatch data:', error));
  }, [activeLayer]);

  const getLayerStyle = (feature: any) => {
    const risk = feature.properties.RISK || feature.properties.Thatch_Ris;
    let color = '#00ff00';  // Default green for low risk

    if (risk === 'High' || risk === 'H') {
      color = '#ff0000';  // Red for high risk
    } else if (risk === 'Medium' || risk === 'M') {
      color = '#ffa500';  // Orange for medium risk
    } else if (risk === 'Low' || risk === 'L') {
      color = '#ffff00';  // Yellow for low risk
    }

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties) {
      layer.bindPopup(
        Object.entries(feature.properties)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
          .join('<br/>')
      );
    }
  };

  const handleRiskTypeChange = (type: string) => {
    setActiveLayer(type as 'litool' | 'thatch');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      position: 'relative'
    }}>
      <Box sx={{ 
        display: 'flex',
        flex: 1,
        position: 'relative',
        height: 'calc(100vh - 220px)'  // Adjust for attribute table
      }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MeasureControl />

          {activeLayer === 'litool' && litoolData && (
            <GeoJSON 
              data={litoolData} 
              style={getLayerStyle}
              onEachFeature={onEachFeature}
            />
          )}
          
          {activeLayer === 'thatch' && thatchData && (
            <GeoJSON 
              data={thatchData} 
              style={getLayerStyle}
              onEachFeature={onEachFeature}
            />
          )}

          <Legend />
        </MapContainer>

        <ControlPanel
          onRiskTypeChange={handleRiskTypeChange}
          onBaseMapChange={() => {}}
          onSearch={() => {}}
          riskClassification={riskClassification}
        />
      </Box>

      <Box sx={{ 
        height: '220px', 
        p: 2,
        backgroundColor: '#1e1e1e'
      }}>
        <AttributeTable 
          data={attributeData} 
          activeLayer={activeLayer}
        />
      </Box>
    </Box>
  );
};

export default RiskMap;
