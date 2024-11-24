import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        'http://localhost:5000/api/v1/admin/orders/update-status',
        { orderId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Sidebar onHoverChange={setSidebarHovered} />

      {/* Main Content */}
      <Box flex={1} padding={3}>
        <h2>Order Management</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Books Ordered</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId?.name || 'Unknown User'}</td>
                  <td>
                    {order.items.map((item) => (
                      <div key={item._id}>
                        <p>{item.bookId?.title || 'Unknown Title'} (x{item.quantity})</p>
                        <p>Price: {item.price}</p>
                        <p>Subtotal: {item.subtotal}</p>
                      </div>
                    ))}
                  </td>
                  <td>{order.orderStatus}</td>
                  <td>
                    <Form.Select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default OrderList;
