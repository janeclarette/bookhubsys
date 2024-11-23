import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { Box, Button, TextField, Modal, Typography, Paper, Stack, IconButton, Divider } from '@mui/material';
import { FaTimes } from 'react-icons/fa';

const NewBook = ({ isModalVisible, onClose }) => {
  const [title, setTitle] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [stock, setStock] = useState(0);
  const [authorId, setAuthorId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
    fetchSuppliers();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('/authors');
      setAuthors(response.data.authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genres');
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/suppliers');
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSave = async () => {
    const bookData = {
      title,
      publicationDate,
      stock,
      authorId,
      genreId,
      supplierId,
      price,
      images,
    };

    try {
      await axios.post('/books', bookData);
      onClose(); // Close modal after saving
    } catch (error) {
      console.error('Error saving new book:', error);
    }
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  return (
    <Modal
      open={isModalVisible}
      onClose={onClose}
      aria-labelledby="new-book-modal-title"
      aria-describedby="new-book-modal-description"
    >
      <Box
        component={Paper}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          
          width: 350, // Reduced width for smaller container
          padding: 2,  // Reduced padding for smaller container
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: 24,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
            Add New Book
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#9e1c63' }}>
            <FaTimes />
          </IconButton>
        </Box>
        <Divider sx={{ marginBottom: 1 }} />

        <form onSubmit={handleSave}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              sx={{
                borderRadius: 2,
                fontSize: '0.875rem', // Smaller font size
              }}
            />
            <TextField
             
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              fullWidth
              required
              sx={{
                borderRadius: 2,
                fontSize: '0.875rem', // Smaller font size
              }}
            />
            <TextField
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              fullWidth
              required
              sx={{
                borderRadius: 2,
                fontSize: '0.875rem', // Smaller font size
              }}
            />
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
              sx={{
                borderRadius: 2,
                fontSize: '0.875rem', // Smaller font size
              }}
            />

            <TextField
              select
              label="Author"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              fullWidth
              required
              sx={{
                borderRadius: 2,
                fontSize: '0.875rem', // Smaller font size
              }}
            >
              {authors.map((author) => (
                <option key={author._id} value={author._id}>{author.name}</option>
              ))}
            </TextField>

            <TextField
              select
              label="Genre"
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              fullWidth
              required
              sx={{
                borderRadius: 2,
                fontSize: '0.875rem', // Smaller font size
              }}
            >
              {genres.map((genre) => (
                <option key={genre._id} value={genre._id}>{genre.name}</option>
              ))}
            </TextField>

            <TextField
              select
              label="Supplier"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              fullWidth
              required
              sx={{
                borderRadius: 2,
                fontSize: '0.875rem', // Smaller font size
              }}
            >
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
              ))}
            </TextField>

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
                  padding: '8px 16px', // Adjusted padding for smaller buttons
                  fontWeight: 'bold',
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  padding: '8px 16px', // Adjusted padding for smaller buttons
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

export default NewBook;
