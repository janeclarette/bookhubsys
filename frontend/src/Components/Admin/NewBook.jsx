import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  Paper,
  Stack,
  IconButton,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { FaTimes } from 'react-icons/fa';

// Validation 

const bookSchema = yup.object().shape({
  title: yup.string().required('Title is required.'),
  publicationDate: yup.date().required('Publication date is required.'),
  stock: yup
    .number()
    .positive('Stock must be greater than 0.')
    .integer('Stock must be an integer.')
    .required('Stock is required.'),
  price: yup
    .number()
    .positive('Price must be greater than 0.')
    .required('Price is required.'),
  authorId: yup.string().required('Author is required.'),
  genreId: yup.string().required('Genre is required.'),
  supplierId: yup.string().required('Supplier is required.'),
  images: yup
    .mixed()
    .test('file-required', 'At least one image is required.', (value) => value && value.length > 0),
});

const NewBook = ({ isModalVisible, onClose }) => {
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      publicationDate: '',
      stock: '',
      price: '',
      authorId: '',
      genreId: '',
      supplierId: '',
      images: null,
    },
    resolver: yupResolver(bookSchema),
  });

  const images = watch('images');

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
      console.error('Error fetching authors:', error.response?.data || error.message);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genres');
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error.response?.data || error.message);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/suppliers');
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error.response?.data || error.message);
    }
  };

  const onSubmit = async (data) => {
    const bookData = new FormData();
    for (const key in data) {
      if (key === 'images') {
        Array.from(data.images).forEach((file) => bookData.append('images', file));
      } else {
        bookData.append(key, data[key]);
      }
    }

    try {
      const response = await axios.post('/books', bookData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Book added successfully:', response.data);
      onClose();
    } catch (error) {
      console.error('Error saving new book:', error.response?.data || error.message);
    }
  };

  const handleFileChange = (e) => {
    setValue('images', e.target.files);
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
          width: 400,
          padding: 2,
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: 24,
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* First Row */}
            <Grid item xs={6}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="publicationDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    error={!!errors.publicationDate}
                    helperText={errors.publicationDate?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            {/* Second Row */}
            <Grid item xs={6}>
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Stock"
                    type="number"
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Price"
                    type="number"
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            {/* Third Row */}
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.authorId}>
                <InputLabel>Author</InputLabel>
                <Controller
                  name="authorId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Author">
                      {authors.map((author) => (
                        <MenuItem key={author._id} value={author._id}>
                          {author.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.authorId && (
                  <Typography color="error" variant="body2">
                    {errors.authorId?.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.genreId}>
                <InputLabel>Genre</InputLabel>
                <Controller
                  name="genreId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Genre">
                      {genres.map((genre) => (
                        <MenuItem key={genre._id} value={genre._id}>
                          {genre.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.genreId && (
                  <Typography color="error" variant="body2">
                    {errors.genreId?.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.supplierId}>
                <InputLabel>Supplier</InputLabel>
                <Controller
                  name="supplierId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Supplier">
                      {suppliers.map((supplier) => (
                        <MenuItem key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.supplierId && (
                  <Typography color="error" variant="body2">
                    {errors.supplierId?.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderRadius: 2,
                  padding: '8px 16px',
                  textTransform: 'none',
                  marginTop: 1,
                }}
              >
                Choose Files
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {images && (
                <Box sx={{ marginTop: 1 }}>
                  {Array.from(images).map((image, index) => (
                    <Typography key={index} variant="body2">
                      {image.name}
                    </Typography>
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#9e1c63',
                  color: '#fff',
                  borderRadius: 2,
                  padding: '8px 16px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#7e1551',
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default NewBook;
