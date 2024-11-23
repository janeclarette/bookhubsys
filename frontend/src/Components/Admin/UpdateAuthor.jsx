import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Sidebar from './Sidebar';
import { Box, Button, TextField, Modal, Typography, Paper, Grid, Stack, Divider, IconButton } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().required('Name is required').max(100, 'Name is too long'),
  bio: yup
    .string()
    .required('Bio is required')
    .max(1000, 'Bio cannot exceed 1000 characters'),
});

const UpdateAuthor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState({ name: '', bio: '' });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      bio: '',
    },
  });

  useEffect(() => {
    fetchAuthor();
  }, []);

  const fetchAuthor = async () => {
    try {
      const response = await axios.get(`/authors/${id}`);
      const { name, bio, imagePath } = response.data.author;
      reset({ name, bio });
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

  const updateAuthor = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('bio', data.bio);

    if (newImages) {
      Array.from(newImages).forEach((image) => formData.append('images', image));
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
    <div>
      <Sidebar />
      <Modal open={true} onClose={() => navigate('/admin/authors')} aria-labelledby="update-author-modal-title">
        <Box component={Paper} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, padding: 2, borderRadius: 3, backgroundColor: '#fff', boxShadow: 24 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
              Update Author
            </Typography>
            <IconButton onClick={() => navigate('/admin/authors')} sx={{ color: '#9e1c63' }}>
              <FaTimes />
            </IconButton>
          </Box>
          <Divider sx={{ marginBottom: 1 }} />

          <form onSubmit={handleSubmit(updateAuthor)}>
            <Grid container spacing={2}>
              {/* Name Field */}
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              {/* Bio Field */}
              <Grid item xs={12}>
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Bio"
                      multiline
                      rows={4}
                      fullWidth
                      error={!!errors.bio}
                      helperText={errors.bio?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              {/* Existing Images */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Existing Images</Typography>
                <Grid container spacing={2}>
                  {images.map((image, index) => (
                    <Grid item key={index} xs={3}>
                      <Box position="relative">
                        <img src={image} alt={`author-${index}`} width="100%" />
                        <IconButton onClick={() => handleDeleteImage(index)} sx={{ position: 'absolute', top: 0, right: 0, color: 'red' }}>
                          <FaTimes />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* File Upload */}
              <Grid item xs={12}>
                <Button variant="outlined" component="label" sx={{ borderRadius: 2, padding: '8px 16px', textTransform: 'none', fontWeight: 'bold', border: '2px dashed #9e1c63', color: '#9e1c63', '&:hover': { border: '2px solid #9e1c63' } }}>
                  Upload Images
                  <input type="file" hidden multiple onChange={handleFileChange} />
                </Button>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between">
                  <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{
                      borderRadius: 2, 
                      textTransform: 'none', 
                      padding: '8px 16px', 
                      fontWeight: 'bold', 
                      backgroundColor: '#9c27b0',  // Purple color
                      '&:hover': {
                        backgroundColor: '#7b1fa2',  // Darker purple on hover
                      },
                    }}
                  >
                    Update Author
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => navigate('/admin/authors')} 
                    sx={{ borderRadius: 2, textTransform: 'none', padding: '8px 16px',  '&:hover': {
                      backgroundColor: '#f48fb1', // Pink hover effect
                    }, }}
                  >
                    Close
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateAuthor;
