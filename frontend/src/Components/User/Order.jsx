import React, { useState, useEffect } from 'react';
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

  // Fetch orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/orders', { withCredentials: true });
        setOrders(response.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      }
    };

    fetchUserOrders();
  }, []);

  const handleReviewSubmit = async () => {
    try {
      console.log('Submitting Review:', review);
      const response = await axios.post('http://localhost:5000/api/v1/reviews', review, { withCredentials: true });
      if (response.status === 201) {
        alert('Review submitted successfully');
        setReview({ rating: 0, comment: '', orderId: '' });
        setOpen(false);
      }
    } catch (err) {
      console.error('Review Submission Error:', err);
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };
  
  

  return (
    <Box sx={styles.container}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Navbar />
      <Header />

      {/* Orders Section */}
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
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setReview({ ...review, orderId: order._id });
                            setOpen(true);
                          }}
                        >
                          Rate & Comment
                        </Button>
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
          <Typography variant="h6" gutterBottom>
            Leave a Review
          </Typography>
          <Rating
            name="rating"
            value={review.rating}
            onChange={(e, newValue) => setReview({ ...review, rating: newValue })}
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
          <Button variant="contained" color="primary" onClick={handleReviewSubmit}>
            Submit
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
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    padding: 20,
    boxShadow: 24,
    borderRadius: 4,
  },
  textField: {
    margin: '20px 0',
  },
};

export default Order;
