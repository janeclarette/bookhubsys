import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Paper,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaTimes } from 'react-icons/fa';
import axios from '../../utils/axiosConfig';

// Validation schema with Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/^[A-Za-z\s]+$/, 'Name must not contain numbers or special characters'),
  bio: yup
    .string()
    .required('Bio is required')
    .max(1000, 'Bio must be less than 1000 characters'),
});

const NewAuthor = ({ isModalVisible, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      bio: '',
    },
  });

  // Initialize images state as an empty array instead of null
  const [images, setImages] = React.useState([]);

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const createAuthor = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('bio', data.bio);
    if (images.length > 0) { // Only append images if any are selected
      Array.from(images).forEach((image) => formData.append('images', image));
    }

    try {
      await axios.post('/authors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Author created successfully!');
      reset(); // Reset the form after successful submission
      setImages([]); // Reset the images state to an empty array
      onClose(); // Close modal after submission
    } catch (error) {
      console.error('Error creating author:', error);
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
            Add New Author
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#9e1c63' }}>
            <FaTimes />
          </IconButton>
        </Box>
        <Divider sx={{ marginBottom: 2 }} />

        <form onSubmit={handleSubmit(createAuthor)}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              sx={{ borderRadius: 2 }}
            />
            <TextField
              label="Bio"
              {...register('bio')}
              error={!!errors.bio}
              helperText={errors.bio?.message}
              multiline
              rows={4}
              fullWidth
              inputProps={{ maxLength: 1000 }}
              sx={{ borderRadius: 2 }}
            />

            <Button
              variant="outlined"
              component="label"
              sx={{
                borderRadius: 2,
                padding: '8px 16px',
                textTransform: 'none',
                fontWeight: 'bold',
                border: '2px dashed #9e1c63',
                color: '#9e1c63',
                '&:hover': {
                  border: '2px solid #9e1c63',
                },
              }}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                onChange={handleFileChange}
              />
            </Button>

            {images.length > 0 && (
              <Typography variant="body2" sx={{ color: 'green' }}>
                {images.length} image(s) selected
              </Typography>
            )}

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
                Create Author
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  reset(); // Clear form on close
                  setImages([]); // Clear images state
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

export default NewAuthor;
