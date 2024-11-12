import React from 'react';
import { Box, Grid, Card, CardContent, Typography, TextField } from '@mui/material';
import { styled } from '@mui/system';
import Sidebar from './Sidebar'; // Import the Sidebar component

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Dashboard Content */}
      <Box
        sx={{
          padding: 4,
          backgroundColor: '#f7f8fc',
          minHeight: '100vh',
          marginLeft: '250px', // Adjust the content area to the right of the sidebar
          flexGrow: 1,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search here..."
            size="small"
            sx={{
              width: 300,
              backgroundColor: '#fff',
              borderRadius: 1,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          <Grid item xs={12} md={4}>
            <StyledCard color="#ff6584">
              <Typography variant="h5">$1k</Typography>
              <Typography>Total Sales</Typography>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard color="#333c72">
              <Typography variant="h5">300</Typography>
              <Typography>Total Orders</Typography>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard color="#6f42c1">
              <Typography variant="h5">5</Typography>
              <Typography>Products Sold</Typography>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          <Grid item xs={12} md={4}>
            <ChartCard title="Total Revenue" />
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard title="Customer Satisfaction" />
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard title="Visitor Insights" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Styled Components for Custom Card Designs
const StyledCard = styled(Card)(({ color }) => ({
  backgroundColor: color,
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 120,
  borderRadius: 8,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
}));

const ChartCard = ({ title }) => (
  <Card sx={{ height: 250, padding: 2, borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" textAlign="center">
        {title}
      </Typography>
      {/* Placeholder for Chart */}
      <Box
        sx={{
          height: 180,
          backgroundColor: '#f0f0f5',
          borderRadius: 2,
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#aaa',
        }}
      >
        Chart Placeholder
      </Box>
    </CardContent>
  </Card>
);

export default Dashboard;
