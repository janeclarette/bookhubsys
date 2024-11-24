import React, { useState, useEffect } from 'react';
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
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#5555',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '20px',

    textAlign: 'center',
    marginTop: '50px',
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
  loading: {
    fontSize: '16px',
    color: '#777',
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
