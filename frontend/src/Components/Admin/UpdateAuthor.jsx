// Components/Admin/UpdateAuthor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Grid
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from '../../utils/axiosConfig';
import Sidebar from './Sidebar'; // Import Sidebar

const UpdateAuthor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchAuthor();
  }, []);

  const fetchAuthor = async () => {
    try {
      const response = await axios.get(`/authors/${id}`);
      const { name, bio, imagePath } = response.data.author;
      setName(name);
      setBio(bio);
      setImages(imagePath);
    } catch (error) {
      console.error('Error fetching author:', error);
    }
  };

  const handleFileChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const updateAuthor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);

    // Append newly uploaded images
    if (newImages) {
      Array.from(newImages).forEach(image => formData.append('images', image));
    }

    try {
      await axios.put(`/authors/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Author updated successfully!');
      navigate('/admin/authors');
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  return (
    <Box component="form" onSubmit={updateAuthor} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>Update Author</Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 2 }}
        inputProps={{ maxLength: 1000 }}
      />

      <Typography variant="h6">Existing Images</Typography>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item key={index} xs={3}>
            <Box position="relative">
              <img src={image} alt={`author-${index}`} width="100%" />
              <IconButton
                onClick={() => handleDeleteImage(index)}
                sx={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ marginTop: '16px' }}
      />
      <Sidebar /> {/* Sidebar for navigation */}
      <Button variant="contained" type="submit" color="primary" sx={{ mt: 2 }}>
        Update Author
      </Button>
    </Box>
  );
};

export default UpdateAuthor;
