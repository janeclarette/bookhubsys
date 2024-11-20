import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import Sidebar from './Sidebar'; // Import Sidebar

const NewGenre = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/genres', { name });
      navigate('/admin/genres');
    } catch (error) {
      console.error('Error creating genre:', error);
    }
  };

  // Layout styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
    },
    content: {
      flex: 1,
      padding: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <Sidebar /> {/* Sidebar for navigation */}
      <main style={styles.content}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add New Genre
          </Typography>
          <TextField
            label="Genre Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit" color="primary">
            Add Genre
          </Button>
        </Box>
      </main>
    </div>
  );
};

export default NewGenre;
