import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Modal, TextField, Rating, CssBaseline, GlobalStyles 
} from '@mui/material';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState({ rating: 0, comment: '', orderId: '' });
  const [submittedReviews, setSubmittedReviews] = useState({}); // Track submissions by order ID
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/orders', { withCredentials: true });
        setOrders(response.data.orders);

        // Check local storage for previously submitted reviews
        const storedReviews = JSON.parse(localStorage.getItem('submittedReviews')) || {};
        setSubmittedReviews(storedReviews);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      }
    };

    fetchUserOrders();
  }, []);

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/reviews', review, { withCredentials: true });
      if (response.status === 201) {
        alert('Review submitted successfully');
        setReview({ rating: 0, comment: '', orderId: '' });
        
        // Mark this order as reviewed and save to local storage
        const newSubmittedReviews = { ...submittedReviews, [review.orderId]: true };
        setSubmittedReviews(newSubmittedReviews);
        localStorage.setItem('submittedReviews', JSON.stringify(newSubmittedReviews));

        setOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <Box sx={styles.container}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Navbar />
      <Header />

      <Box sx={styles.ordersContainer}>
        <Typography variant="h4" sx={styles.title}>
          Your Orders
        </Typography>

        {error && <Typography sx={styles.error}>{error}</Typography>}

        {orders.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Shipping Address</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.orderStatus}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      {order.items.map((item) => (
                        <Box key={item.bookId._id}>
                          <Typography>
                            {item.bookId.title} x {item.quantity}
                          </Typography>
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell>{order.shippingInfo.address}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {order.orderStatus === 'Delivered' && (
                        <>
                          <Button
                            variant="contained"
                            sx={styles.rateButton}
                            onClick={() => {
                              setReview({ ...review, orderId: order._id });
                              setOpen(true);
                            }}
                            disabled={submittedReviews[order._id]} // Disable if reviewed
                          >
                            Rate & Comment
                          </Button>
                          <Button
                            variant="outlined"
                            sx={styles.viewRatingButton}
                            onClick={() => navigate(`/rating?orderId=${order._id}`)}
                          >
                            View Rating
                          </Button>
                        </>
                      )}
                      {submittedReviews[order._id] && (
                        <Typography variant="body2" sx={styles.submittedText}>
                          Review Submitted
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No orders found.</Typography>
        )}
      </Box>

      {/* Review Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={styles.modal}>
          <Typography variant="h6" sx={styles.modalTitle}>
            Leave a Review
          </Typography>
          <Box sx={styles.rating}>
            <Rating
              name="rating"
              value={review.rating}
              onChange={(e, newValue) => setReview({ ...review, rating: newValue })}
              size="large"
            />
          </Box>
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
            onClick={handleReviewSubmit}
          >
            Submit Review
          </Button>
        </Box>
      </Modal>

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
  ordersContainer: {
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
  rateButton: {
    marginRight: '10px',
    background: 'linear-gradient(45deg, #6a1b9a, #8e24aa)',
    color: '#fff',
    textTransform: 'capitalize',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
    },
  },
  viewRatingButton: {
    color: '#6a1b9a',
    border: '1px solid #6a1b9a',
    textTransform: 'capitalize',
    '&:hover': {
      backgroundColor: '#f3e5f5',
    },
  },
  submittedText: {
    color: 'green',
    marginTop: '10px',
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
    padding: '20px',
  },
  modalTitle: {
    marginBottom: '10px',
    color: '#333',
    fontWeight: 'bold',
  },
  textField: {
    margin: '20px 0',
    '& .MuiInputBase-root': {
      borderRadius: '8px',
    },
  },
  rating: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(45deg, #1e88e5, #42a5f5)',
    color: '#fff',
    textTransform: 'capitalize',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
    },
  },
};

export default Order;
