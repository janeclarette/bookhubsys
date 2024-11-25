import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Sidebar from './Sidebar';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Modal, Typography, Paper, Grid, Stack, Divider, IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { FaTimes } from 'react-icons/fa';

// Validation 
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  publicationDate: Yup.date().required('Publication date is required'),
  stock: Yup.number().min(0, 'Stock must be a positive number').required('Stock is required'),
  price: Yup.number().min(0, 'Price must be a positive number').required('Price is required'),
  authorId: Yup.string().required('Author is required'),
  genreId: Yup.string().required('Genre is required'),
  supplierId: Yup.string().required('Supplier is required'),
});

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [bookDetails, setBookDetails] = useState({
    title: '',
    publicationDate: '',
    stock: 0,
    price: '',
    authorId: '',
    genreId: '',
    supplierId: '',
  });

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
    fetchSuppliers();
    fetchBook();
  }, []);

  const fetchAuthors = async () => {
    const response = await axios.get('/authors');
    setAuthors(response.data.authors);
  };

  const fetchGenres = async () => {
    const response = await axios.get('/genres');
    setGenres(response.data.genres);
  };

  const fetchSuppliers = async () => {
    const response = await axios.get('/suppliers');
    setSuppliers(response.data.suppliers);
  };

  const fetchBook = async () => {
    try {
      const response = await axios.get(`/books/${id}`);
      setBookDetails(response.data.book);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('publicationDate', values.publicationDate);
    formData.append('stock', values.stock);
    formData.append('price', values.price);
    formData.append('authorId', values.authorId);
    formData.append('genreId', values.genreId);
    formData.append('supplierId', values.supplierId);

    try {
      await axios.put(`/books/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Book updated successfully!');
      navigate('/admin/books');
    } catch (error) {
      console.error('Error updating book:', error);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <Sidebar />
      <Modal open={true} onClose={() => navigate('/admin/books')} aria-labelledby="update-book-modal-title">
        <Box component={Paper} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: 2, borderRadius: 3, backgroundColor: '#fff', boxShadow: 24 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
              Update Book
            </Typography>
            <IconButton onClick={() => navigate('/admin/books')} sx={{ color: '#9e1c63' }}>
              <FaTimes />
            </IconButton>
          </Box>
          <Divider sx={{ marginBottom: 1 }} />
          <Formik initialValues={bookDetails} validationSchema={validationSchema} enableReinitialize onSubmit={handleSubmit}>
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* First Row */}
                  <Grid item xs={6}>
                    <label>
                      <Field as={TextField} name="title" label="Title" fullWidth required />
                      <ErrorMessage name="title" component="div" />
                    </label>
                  </Grid>
                  <Grid item xs={6}>
                    <label>
                      <Field as={TextField} name="publicationDate" type="date" fullWidth required />
                      <ErrorMessage name="publicationDate" component="div" />
                    </label>
                  </Grid>

                  {/* Second Row */}
                  <Grid item xs={6}>
                    <label>
                      Stock:
                      <Field as={TextField} name="stock" type="number" fullWidth required />
                      <ErrorMessage name="stock" component="div" />
                    </label>
                  </Grid>
                  <Grid item xs={6}>
                    <label>
                      Price:
                      <Field as={TextField} name="price" type="number" fullWidth required />
                      <ErrorMessage name="price" component="div" />
                    </label>
                  </Grid>

                  {/* Third Row */}
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Author</InputLabel>
                      <Field as={Select} name="authorId" label="Author">
                        <MenuItem value="">Select Author</MenuItem>
                        {authors.map((author) => (
                          <MenuItem key={author._id} value={author._id}>
                            {author.name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="authorId" component="div" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Genre</InputLabel>
                      <Field as={Select} name="genreId" label="Genre">
                        <MenuItem value="">Select Genre</MenuItem>
                        {genres.map((genre) => (
                          <MenuItem key={genre._id} value={genre._id}>
                            {genre.name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="genreId" component="div" />
                    </FormControl>
                  </Grid>

                  {/* Supplier */}
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Supplier</InputLabel>
                      <Field as={Select} name="supplierId" label="Supplier">
                        <MenuItem value="">Select Supplier</MenuItem>
                        {suppliers.map((supplier) => (
                          <MenuItem key={supplier._id} value={supplier._id}>
                            {supplier.name}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="supplierId" component="div" />
                    </FormControl>
                  </Grid>

                  {/* Images */}
                  <Grid item xs={12}>
                    <Button variant="outlined" component="label" sx={{ borderRadius: 2, padding: '8px 16px', textTransform: 'none', fontWeight: 'bold', border: '2px dashed #9e1c63', color: '#9e1c63', '&:hover': { border: '2px solid #9e1c63' } }}>
                      Upload Images
                      <input type="file" hidden multiple onChange={(e) => setFieldValue('images', e.target.files)} />
                    </Button>
                  </Grid>

                {/* Submit Button */}
<Grid item xs={12}>
  <Stack direction="row" justifyContent="space-between">
    <Button 
      type="submit" 
      variant="contained" 
      sx={{
        borderRadius: 2, 
        textTransform: 'none', 
        padding: '8px 16px', 
        fontWeight: 'bold', 
        backgroundColor: '#9c27b0', 
        '&:hover': {
          backgroundColor: '#7b1fa2',
        }
      }} 
      disabled={isSubmitting}
    >
      Update Book
    </Button>
    <Button 
      variant="outlined" 
      color="error" 
      onClick={() => navigate('/admin/books')} 
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
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateBook;
