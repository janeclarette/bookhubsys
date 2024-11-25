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
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../utils/axiosConfig';
import { FaTimes } from 'react-icons/fa';

const NewSupplier = ({ open, onClose, onSupplierCreated }) => {

  //  Yup
  const schema = yup.object().shape({
    name: yup.string().required('Supplier Name is required'),
    contactInfo: yup
      .string()
      .matches(/^\d+$/, 'Contact Info must be a valid number')
      .required('Contact Info is required'),
    address: yup.string().required('Address is required'),
    images: yup
      .mixed()
      .test('fileCount', 'At least one image is required', (value) => value && value.length > 0),
  });

  //  React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      contactInfo: '',
      address: '',
      images: [],
    },
  });

  const images = watch('images');

  const handleFileChange = (e) => {
    setValue('images', e.target.files);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('contactInfo', data.contactInfo);
    formData.append('address', data.address);
    Array.from(data.images).forEach((image) => formData.append('images', image));

    try {
      await axios.post('/suppliers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Supplier created successfully!');
      reset();
      onSupplierCreated(); 
      onClose(); 
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="new-supplier-modal">
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
          <Typography id="new-supplier-modal" variant="h6">
            Add New Supplier
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#9e1c63' }}>
            <FaTimes />
          </IconButton>
        </Box>
        <Divider sx={{ marginBottom: 2 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* Supplier Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Supplier Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            {/* Contact Info */}
            <Controller
              name="contactInfo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contact Info"
                  fullWidth
                  error={!!errors.contactInfo}
                  helperText={errors.contactInfo?.message}
                />
              )}
            />

            {/* Address */}
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />

            {/* File Upload */}
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
            {errors.images && (
              <Typography variant="body2" sx={{ color: 'red' }}>
                {errors.images.message}
              </Typography>
            )}
            {images && images.length > 0 && (
              <Typography variant="body2" sx={{ color: 'green' }}>
                {images.length} image(s) selected
              </Typography>
            )}

            {/* Submit and Close Buttons */}
            <Stack direction="row" justifyContent="space-between">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  backgroundColor: '#9c27b0', 
                  '&:hover': {
                    backgroundColor: '#7b1fa2',
                  },
                }}
              >
                Create Supplier
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: '#f06292', 
                    borderColor: '#f06292', 
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

export default NewSupplier;
