import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Layout/Navbar';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/me', { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <Navbar />
            {/* Sub-navbar for order statuses */}
        <div style={styles.subNavbar}>
        <NavLink to="pending" style={styles.navLink} activeStyle={styles.activeNavLink}>
          Pending
        </NavLink>
        <NavLink to="shipped" style={styles.navLink} activeStyle={styles.activeNavLink}>
          Shipped
        </NavLink>
        <NavLink to="delivered" style={styles.navLink} activeStyle={styles.activeNavLink}>
          Delivered
        </NavLink>
        <NavLink to="cancelled" style={styles.navLink} activeStyle={styles.activeNavLink}>
          Cancelled
        </NavLink>
      </div>
      
      <div style={styles.container}>
        <h2 style={styles.title}>User Profile</h2>
        {user ? (
          <div style={styles.userInfo}>
            <img src={user.avatar?.url} alt="User Avatar" style={styles.avatar} />
            <div style={styles.details}>
              <h3 style={styles.name}>{user.name}</h3>
              <p style={styles.email}>Email: {user.email}</p>
            </div>
          </div>
        ) : (
          <p style={styles.loading}>Loading user information...</p>
        )}
      </div>



      {/* Routes for order statuses */}
      <div style={styles.statusContainer}>
        <Routes>
          <Route path="pending" element={<OrderStatus status="Pending" />} />
          <Route path="shipped" element={<OrderStatus status="Shipped" />} />
          <Route path="delivered" element={<OrderStatus status="Delivered" />} />
          <Route path="cancelled" element={<OrderStatus status="Cancelled" />} />
        </Routes>
      </div>
    </div>
  );
};

// Component to display orders by status
const OrderStatus = ({ status }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/orders?status=${status}`, { withCredentials: true });
        setOrders(response.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      }
    };

    fetchOrders();
  }, [status]);

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div>
      <h3 style={styles.statusTitle}>{status} Orders</h3>
      {orders.length > 0 ? (
        <ul style={styles.orderList}>
          {orders.map(order => (
            <li key={order._id} style={styles.orderItem}>
              <strong>Order ID:</strong> {order._id} <br />
              <strong>Total:</strong> ${order.totalAmount} <br />
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.noOrders}>No {status.toLowerCase()} orders found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    marginTop: '20px',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ddd',
  },
  details: {
    textAlign: 'center',
  },
  name: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '10px',
  },
  email: {
    fontSize: '16px',
    color: '#666',
  },
  subNavbar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
    padding: '10px 0',
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
  navLink: {
    textDecoration: 'none',
    color: '#666',
    fontSize: '16px',
    fontWeight: '500',
  },
  activeNavLink: {
    color: '#007bff',
    fontWeight: 'bold',
    borderBottom: '2px solid #007bff',
  },
  statusContainer: {
    marginTop: '20px',
  },
  statusTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  orderList: {
    listStyle: 'none',
    padding: 0,
  },
  orderItem: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '10px',
  },
  noOrders: {
    fontSize: '16px',
    color: '#666',
  },
  error: {
    color: '#d9534f',
    backgroundColor: '#f8d7da',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    width: '90%',
    maxWidth: '400px',
    margin: '20px auto',
  },
};

export default UserProfile;
