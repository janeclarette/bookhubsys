import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, Typography, TextField, Rating, Button, CssBaseline, GlobalStyles 
} from '@mui/material';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RatingPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [review, setReview] = useState({ rating: 0, comment: '', orderId });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/reviews/${orderId}`, { withCredentials: true });
        setReview(response.data.review);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch review');
      }
    };

    fetchReview();
  }, [orderId]);

  const handleReviewUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/v1/reviews/${orderId}`, review, { withCredentials: true });
      toast.success('Review updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review');
      toast.error('Failed to update review');
    }
  };

  return (
    <Box sx={styles.container}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Navbar />
      <Header />

      <ToastContainer />

      <Box sx={styles.reviewContainer}>
        <Typography variant="h4" sx={styles.title}>
          Edit Your Review
        </Typography>

        {error && <Typography sx={styles.error}>{error}</Typography>}

        <Box sx={styles.form}>
          <Typography variant="h6" sx={styles.label}>
            Rating
          </Typography>
          <Rating
            name="rating"
            value={review.rating}
            onChange={(e, newValue) => setReview({ ...review, rating: newValue })}
            size="large"
          />

          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={4}
            sx={styles.textField}
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
          />

          <Button
            variant="contained"
            sx={styles.submitButton}
            onClick={handleReviewUpdate}
          >
            Update Review
          </Button>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

// Styles
const globalStyles = {
  body: {
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    fontFamily: "'Lora', serif",
  },
  '*': {
    boxSizing: 'border-box',
  },
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  reviewContainer: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  label: {
    fontWeight: 'bold',
  },
  textField: {
    '& .MuiInputBase-root': {
      borderRadius: '8px',
    },
  },
  submitButton: {
    background: 'linear-gradient(45deg, #1e88e5, #42a5f5)',
    color: '#fff',
    textTransform: 'capitalize',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976d2, #2196f3)',
    },
  },
};

export default RatingPage;
