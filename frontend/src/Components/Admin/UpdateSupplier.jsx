import React, { useEffect, useState } from 'react';
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
  name: yup
    .string()
    .required('Supplier name is required')
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must not exceed 50 characters'),
  contactInfo: yup
    .string()
    .required('Contact info is required')
    .matches(
      /^[+]?[0-9]{10,15}$/,
      'Invalid contact info (e.g., +1234567890 or 1234567890)'
    ),
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters long'),
  images: yup
    .mixed()
    .test(
      'fileSize',
      'Each image file size must be less than 2MB',
      (value) =>
        !value ||
        Array.from(value).every((file) => file.size <= 2 * 1024 * 1024)
    )
    .test(
      'fileType',
      'Only image files (JPEG, PNG, JPG) are allowed',
      (value) =>
        !value ||
        Array.from(value).every((file) =>
          ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
        )
    ),
});

const UpdateSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({
    name: '',
    contactInfo: '',
    address: '',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      contactInfo: '',
      address: '',
      images: null,
    },
  });

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`/suppliers/${id}`);
        reset({ 
          name: response.data.supplier.name,
          contactInfo: response.data.supplier.contactInfo,
          address: response.data.supplier.address,
        });
        setSupplier(response.data.supplier);
      } catch (error) {
        console.error('Error fetching supplier:', error);
      }
    };
    fetchSupplier();
  }, [id, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('contactInfo', data.contactInfo);
    formData.append('address', data.address);

    if (data.images) {
      Array.from(data.images).forEach((image) => formData.append('images', image));
    }

    try {
      await axios.put(`/suppliers/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Supplier updated successfully!');
      navigate('/admin/suppliers');
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  return (
    <div>
      <Sidebar />
      <Modal open={true} onClose={() => navigate('/admin/suppliers')} aria-labelledby="update-supplier-modal-title">
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
              Update Supplier
            </Typography>
            <IconButton onClick={() => navigate('/admin/suppliers')} sx={{ color: '#9e1c63' }}>
              <FaTimes />
            </IconButton>
          </Box>
          <Divider sx={{ marginBottom: 1 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Supplier Name Field */}
              <Grid item xs={12}>
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
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              {/* Contact Info Field */}
              <Grid item xs={12}>
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
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              {/* Address Field */}
              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      multiline
                      rows={3}
                      fullWidth
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              {/* Images Field */}
              <Grid item xs={12}>
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                      {errors.images && (
                        <Typography color="error" variant="body2">
                          {errors.images.message}
                        </Typography>
                      )}
                      {field.value && Array.from(field.value).map((file, index) => (
                        <Typography key={index} variant="body2">
                          {file.name}
                        </Typography>
                      ))}
                    </>
                  )}
                />
              </Grid>

              {/* Buttons */}
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
                      backgroundColor: '#9c27b0', // Purple color
                      '&:hover': {
                        backgroundColor: '#7b1fa2', // Darker purple on hover
                      },
                      
                    }}
                  >
                    Update Supplier
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => navigate('/admin/suppliers')}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      padding: '8px 16px',
                      '&:hover': {
                        backgroundColor: '#f48fb1', // Pink hover effect
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

export default UpdateSupplier;
