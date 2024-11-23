import React from 'react';
import axios from '../../utils/axiosConfig';
import { Box, Button, TextField, Typography, Modal, Paper, Stack, IconButton, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaTimes } from 'react-icons/fa';

// Validation schema with Yup
const schema = yup.object().shape({
  name: yup.string().required('Genre name is required').min(3, 'Genre name must be at least 3 characters'),
});

const NewGenre = ({ isModalVisible, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('/genres', data);
      alert('Genre created successfully!');
      reset(); // Reset the form fields
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error creating genre:', error);
    }
  };

  return (
    <Modal
      open={isModalVisible}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        component={Paper}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          padding: 3,
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: 24,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Genre
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#9e1c63' }}>
            <FaTimes />
          </IconButton>
        </Box>
        <Divider sx={{ marginBottom: 2 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Genre Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              sx={{ borderRadius: 2 }}
            />

            <Stack direction="row" justifyContent="space-between">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  backgroundColor: '#9e1c63', // Purple button
                  '&:hover': {
                    backgroundColor: '#7a1451', // Darker purple on hover
                  },
                }}
              >
                Add Genre
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  reset(); // Clear form on close
                  onClose();
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: '#f06292', // Pink hover effect
                    borderColor: '#f06292', // Pink border on hover
                  },
                }}
              >
                Close
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default NewGenre;
