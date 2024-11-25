import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Layout/Navbar';

const UserProfileEdit = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', avatar: '' });
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/me', { withCredentials: true });
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          avatar: response.data.user.avatar?.url || '',
        });
        setAvatarPreview(response.data.user.avatar?.url || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setAvatarPreview(URL.createObjectURL(files[0]));
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
  
     
      if (formData.avatar) {
        form.append('avatar', formData.avatar);
      }
  
      
      const response = await axios.put('http://localhost:5000/api/v1/me/update', form, {
        withCredentials: true,
      });
  
      alert('Profile updated successfully');
      setUser(response.data.user);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };
  
  
  

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Edit Profile</h2>
        {user ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={styles.userInfo}>
              <img
                src={avatarPreview}
                alt="User Avatar"
                style={styles.avatar}
              />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.details}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton}>Update Profile</button>
          </form>
        ) : (
          <p style={styles.loading}>Loading user information...</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '20px',
  },
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
  label: {
    fontSize: '16px',
    color: '#444',
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    maxWidth: '300px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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

export default UserProfileEdit;
