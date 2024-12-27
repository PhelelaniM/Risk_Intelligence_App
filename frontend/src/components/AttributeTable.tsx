import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface AttributeTableProps {
  data: any[];
  activeLayer: 'litool' | 'thatch';
}

const AttributeTable: React.FC<AttributeTableProps> = ({ data, activeLayer }) => {
  const getLitoolColumns = () => [
    { id: 'LITOOL_ID', label: 'LITOOL_ID' },
    { id: 'LATITUDE', label: 'LATITUDE' },
    { id: 'LONGITUDE', label: 'LONGITUDE' },
    { id: 'REASON', label: 'REASON' },
    { id: 'CREATE_DAT', label: 'CREATE_DAT' },
    { id: 'PRCL_KEY', label: 'PRCL_KEY' },
    { id: 'PARCEL_NO', label: 'PARCEL_NO' },
    { id: 'RISK', label: 'RISK' },
    { id: 'PL_UW', label: 'PL_UW' },
    { id: 'CL_UW', label: 'CL_UW' },
    { id: 'Label', label: 'Label' },
    { id: 'Notes', label: 'Notes' },
    { id: 'Status', label: 'Status' }
  ];

  const getThatchColumns = () => [
    { id: 'Area', label: 'Area' },
    { id: 'Town', label: 'Town' },
    { id: 'Thatch_Ris', label: 'Thatch_Ris' },
    { id: 'PL', label: 'PL' },
    { id: 'CL', label: 'CL' },
    { id: 'Shape_Leng', label: 'Shape_Leng' },
    { id: 'Shape_Area', label: 'Shape_Area' },
    { id: 'geometry', label: 'geometry' }
  ];

  const columns = activeLayer === 'litool' ? getLitoolColumns() : getThatchColumns();

  if (data.length === 0) {
    return (
      <Paper sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No risk data available for this area
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ 
        p: 1, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#2b2b2b',
        color: 'white'
      }}>
        <Typography variant="subtitle2" sx={{ color: 'white' }}>
          {activeLayer === 'litool' ? 'Flood Risk Data' : 'Thatch Risk Data'}
        </Typography>
        <IconButton size="small" onClick={() => {}} sx={{ color: 'white' }}>
          <RefreshIcon />
        </IconButton>
      </Box>
      <TableContainer sx={{ 
        maxHeight: 200,
        backgroundColor: '#1e1e1e',
        '& .MuiTableCell-root': {
          color: 'white',
          borderBottom: '1px solid #404040'
        }
      }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ 
                    backgroundColor: '#2b2b2b',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    color: 'white !important'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                hover 
                key={index}
                sx={{ 
                  '&:hover': {
                    backgroundColor: '#404040 !important'
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {row[column.id]?.toString() || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AttributeTable;
