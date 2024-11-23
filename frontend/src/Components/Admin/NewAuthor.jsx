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

const NewAuthor = ({ isModalVisible, onClose }) => {  // Changed to match prop name
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [images, setImages] = useState(null);

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const createAuthor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (images) {
      Array.from(images).forEach((image) => formData.append('images', image));
    }

    try {
      await axios.post('/authors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Author created successfully!');
      setName('');
      setBio('');
      setImages(null);
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error creating author:', error);
    }
  };

  return (
    <Modal
      open={isModalVisible}  // Modal visibility based on the prop
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

        <form onSubmit={createAuthor}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              sx={{ borderRadius: 2 }}
            />
            <TextField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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
                Create Author
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

export default NewAuthor;


