import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TableContainer, Paper } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import Sidebar from './Sidebar';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [isSidebarHovered, setSidebarHovered] = useState(false); // Sidebar hover state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/orders/admin/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId) => {
    try {
      await axios.put(
        'http://localhost:5000/api/v1/orders/admin/orders/update-status',
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Order status updated');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const columns = [
    {
      name: '_id',
      label: 'Order ID',
    },
    {
      name: 'userId',
      label: 'User',
      options: {
        customBodyRender: (value) => (value?.name || 'Unknown User'),
      },
    },
    {
      name: 'items',
      label: 'Books Ordered',
      options: {
        customBodyRender: (items) =>
          items.map((item) => (
            <Box key={item._id} marginBottom={1}>
              <Typography>{item?.bookId?.title || 'Unknown Book'} (x{item.quantity})</Typography>
              <Typography>Price: {item.price}</Typography>
              <Typography>Subtotal: {item.subtotal}</Typography>
            </Box>
          )) || 'No items',
      },
    },
    {
      name: 'orderStatus',
      label: 'Status',
      options: {
        customBodyRender: (value, tableMeta) => (
          <select
            value={status || value}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        ),
      },
    },
    {
      name: '_id',
      label: 'Action',
      options: {
        customBodyRender: (value) => (
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#e91e63',
              color: 'white',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#d81b60' },
            }}
            onClick={() => handleStatusChange(value)}
          >
            Update Status
          </Button>
        ),
      },
    },
  ];

  const options = {
    selectableRows: 'none',
    responsive: 'standard',
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar component with hover effect */}
      <Sidebar onHoverChange={setSidebarHovered} />

      {/* Main content */}
      <Box
        style={{
          marginLeft: isSidebarHovered ? '250px' : '60px',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          width: '100%',
        }}
      >
        {/* Header */}
        <Box marginBottom={2}>
          <Typography variant="h4" sx={{ fontFamily: 'Fjalla One, sans-serif', fontWeight: 'bold' }}>
            Order Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray', marginTop: 2 }}>
            View and manage all customer orders.
          </Typography>
        </Box>

        {/* DataTable */}
        {loading ? (
          <Typography>Loading orders...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <MUIDataTable title="Orders" data={orders} columns={columns} options={options} />
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default OrderList;
