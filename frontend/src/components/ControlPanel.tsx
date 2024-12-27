import React, { useState } from 'react';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)', // visible border
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.5)', // darker on hover
    },
    '& input': {
      color: 'black', // black text for input
    }
  },
  '& .MuiInputLabel-root': {
    color: 'black', // black text for label
  },
});

interface ControlPanelProps {
  onRiskTypeChange: (type: string) => void;
  onBaseMapChange: (type: string) => void;
  onSearch: (coordinates: string) => void;
  riskClassification: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onRiskTypeChange,
  onBaseMapChange,
  onSearch,
  riskClassification,
}) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [riskType, setRiskType] = useState('thatch');
  const [baseMap, setBaseMap] = useState('street');

  const handleSearch = () => {
    onSearch(`${latitude},${longitude}`);
  };

  const handleReset = () => {
    setLatitude('');
    setLongitude('');
    onSearch('');
  };

  return (
    <Paper sx={{ 
      p: 2, 
      m: 2, 
      width: '300px', 
      position: 'absolute', 
      top: 10, 
      left: 10, 
      zIndex: 1000,
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 500, mb: 2 }}>
        Risk Intelligence Monitoring
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Risk Type</InputLabel>
        <Select
          value={riskType}
          label="Risk Type"
          onChange={(e) => {
            setRiskType(e.target.value);
            onRiskTypeChange(e.target.value);
          }}
        >
          <MenuItem value="thatch">Thatch Accumulation Risk</MenuItem>
          <MenuItem value="litool">Flood Risk (Litool)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Base Map</InputLabel>
        <Select
          value={baseMap}
          label="Base Map"
          onChange={(e) => {
            setBaseMap(e.target.value);
            onBaseMapChange(e.target.value);
          }}
        >
          <MenuItem value="street">Street Map</MenuItem>
          <MenuItem value="satellite">Satellite</MenuItem>
          <MenuItem value="terrain">Terrain</MenuItem>
        </Select>
      </FormControl>
      
      <Typography variant="subtitle2" gutterBottom sx={{ color: 'black' }}>
        GPS Coordinates
      </Typography>
      <StyledTextField
        fullWidth
        label="Latitude"
        placeholder="e.g. -26.2041"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        sx={{ mb: 1 }}
      />
      <StyledTextField
        fullWidth
        label="Longitude"
        placeholder="e.g. 28.0473"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleSearch}
          sx={{ 
            flex: 1,
            textTransform: 'none',
            backgroundColor: '#1976d2'
          }}
        >
          Search
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleReset}
          sx={{ 
            flex: 1,
            textTransform: 'none',
            color: '#666',
            borderColor: '#ccc'
          }}
        >
          Reset
        </Button>
      </Box>

      {riskClassification && (
        <>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'black' }}>
            Risk Classification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {riskClassification}
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default ControlPanel;
