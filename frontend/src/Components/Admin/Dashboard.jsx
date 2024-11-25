import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import { Box, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import Sidebar from './Sidebar'; // Optional: Import your Sidebar component if needed

const Dashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartInstance, setChartInstance] = useState(null);
  

  const fetchSalesData = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
  
      const response = await fetch(`http://localhost:5000/api/v1/orders/monthly-sales?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorText = await response.text(); // Capture the raw error response
        console.error('Error response:', errorText); // Log the error for debugging
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json(); // Parse as JSON
  
      if (data.success) {
        const labels = data.data.map((sale) => `${sale.month}-${sale.year}`);
        const sales = data.data.map((sale) => sale.totalSales);
        renderChart(labels, sales);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch sales data:', error.message);
    }
  };
  
  

  const renderChart = (labels, sales) => {
    const ctx = document.getElementById('salesChart').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy(); // Destroy existing chart instance to prevent overlaps
    }
    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Monthly Sales (in PHP)', // Change the label to 'in PHP'
            data: sales,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Sales (in PHP)', // Change the label for the Y-axis to Peso
            },
            ticks: {
              callback: function (value) {
                // Format the y-axis ticks as Peso currency
                return '₱' + value.toLocaleString();
              },
            },
          },
          x: {
            title: {
              display: true,
              text: 'Month-Year',
            },
          },
        },
      },
    });
    setChartInstance(newChartInstance);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSalesData();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Component - Optional */}
      {Sidebar && <Sidebar />}

      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* Filter Section */}
        <Card sx={{ marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filter Sales Data
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
            >
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ alignSelf: 'center' }}
              >
                Filter Sales
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Sales Chart
            </Typography>
            <Box sx={{ position: 'relative', height: 400, width: '100%' }}>
              <canvas id="salesChart"></canvas>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
