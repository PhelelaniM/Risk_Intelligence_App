import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Map as MapIcon } from '@mui/icons-material';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MapIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Risk Intelligence Monitoring
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
