import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Sidebar from './Sidebar';
import { Box, Button, TextField, Modal, Typography, Paper, Grid, Stack, Divider, IconButton } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Genre name is required')
    .min(3, 'Genre name must be at least 3 characters')
    .max(50, 'Genre name must not exceed 50 characters'),
});

const UpdateGenre = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [genre, setGenre] = useState({ name: '' });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await axios.get(`/genres/${id}`);
        reset({ name: response.data.genre.name });
        setGenre(response.data.genre);
      } catch (error) {
        console.error('Error fetching genre:', error);
      }
    };
    fetchGenre();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`/genres/${id}`, { name: data.name });
      alert('Genre updated successfully!');
      navigate('/admin/genres');
    } catch (error) {
      console.error('Error updating genre:', error);
    }
  };

  return (
    <div>
      <Sidebar />
      <Modal open={true} onClose={() => navigate('/admin/genres')} aria-labelledby="update-genre-modal-title">
        <Box
          component={Paper}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            padding: 2,
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: 24,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
              Update Genre
            </Typography>
            <IconButton onClick={() => navigate('/admin/genres')} sx={{ color: '#9e1c63' }}>
              <FaTimes />
            </IconButton>
          </Box>
          <Divider sx={{ marginBottom: 1 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Genre Name Field */}
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Genre Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      padding: '8px 16px',
                      fontWeight: 'bold',
                      backgroundColor: '#9c27b0', 
                      '&:hover': {
                        backgroundColor: '#7b1fa2', 
                      },
                    }}
                  >
                    Update Genre
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => navigate('/admin/genres')}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      padding: '8px 16px',
                      '&:hover': {
                        backgroundColor: '#f48fb1', 
                      },
                    }}
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

export default UpdateGenre;
