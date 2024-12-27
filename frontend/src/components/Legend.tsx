import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const Legend: React.FC = () => {
  const legendItems = [
    { color: '#ff0000', label: 'High Risk' },
    { color: '#ffa500', label: 'Medium Risk' },
    { color: '#ffff00', label: 'Low Risk' },
    { color: '#00ff00', label: 'No Risk' },
  ];

  return (
    <Paper
      sx={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        padding: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1000,
        minWidth: '150px',
        color: '#000000'  // Set text color to black
      }}
    >
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#000000' }}>
        Risk Level
      </Typography>
      {legendItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            marginBottom: 0.5,
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: item.color,
              border: '1px solid rgba(0, 0, 0, 0.2)',
            }}
          />
          <Typography variant="body2" sx={{ color: '#000000' }}>{item.label}</Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default Legend;
