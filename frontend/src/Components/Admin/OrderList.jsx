import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  // Fetch all orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/orders/admin/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  // Add token for authentication if needed
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
      const response = await axios.put(
        'http://localhost:5000/api/v1/orders/admin/orders/update-status',
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Order status updated');
      // Re-fetch orders after update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div>
      <h1>Order Management</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Books Ordered</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId.name}</td>
                <td>
                  {order.items.map((item) => (
                    <div key={item._id}>
                      <p>{item.bookId.title} (x{item.quantity})</p>
                      <p>Price: {item.price}</p>
                      <p>Subtotal: {item.subtotal}</p>
                    </div>
                  ))}
                </td>
                <td>
                  <select
                    value={status || order.orderStatus}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleStatusChange(order._id)}>Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
