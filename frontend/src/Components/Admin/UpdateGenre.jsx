// frontend/Admin/UpdateGenre.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

const UpdateGenre = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await axios.get(`/genres/${id}`);
        setName(response.data.genre.name);
      } catch (error) {
        console.error('Error fetching genre:', error);
      }
    };
    fetchGenre();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/genres/${id}`, { name });
      navigate('/admin/genres');
    } catch (error) {
      console.error('Error updating genre:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>Update Genre</Typography>
      <TextField
        label="Genre Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" type="submit" color="primary">Update Genre</Button>
    </Box>
  );
};

export default UpdateGenre;
