import React, { useState } from 'react';
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
import axios from '../../utils/axiosConfig';
import { FaTimes } from 'react-icons/fa';

const NewSupplier = ({ open, onClose, onSupplierCreated }) => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const createSupplier = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('contactInfo', contactInfo);
    formData.append('address', address);
    Array.from(images).forEach((image) => formData.append('images', image));

    try {
      await axios.post('/suppliers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Supplier created successfully!');
      setName('');
      setContactInfo('');
      setAddress('');
      setImages([]);
      onSupplierCreated(); // Notify parent to refresh the supplier list
      onClose(); // Close the modal
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

        <form onSubmit={createSupplier}>
          <Stack spacing={2}>
            <TextField
              label="Supplier Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              sx={{ borderRadius: 2 }}
            />
            <TextField
              label="Contact Info"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              fullWidth
              required
              sx={{ borderRadius: 2 }}
            />
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
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
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>

            {images && images.length > 0 && (
              <Typography variant="body2" sx={{ color: 'green' }}>
                {images.length} image(s) selected
              </Typography>
            )}

            <Stack direction="row" justifyContent="space-between">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  padding: '10px 20px',
                  fontWeight: 'bold',
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
