import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import { Box, Button, TextField, Typography, Modal, Paper, Stack, IconButton, Divider } from '@mui/material';
import { FaTimes } from 'react-icons/fa';

const NewGenre = ({ isModalVisible, onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/genres', { name });
      alert('Genre created successfully!');
      setName('');
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

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Genre Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              sx={{ borderRadius: 2 }}
            />

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
                Add Genre
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

export default NewGenre;
