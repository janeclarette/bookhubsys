import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, Stack, Paper } from '@mui/material';
import axios from 'axios';
import Navbar from '../Layout/Navbar';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems = [], user } = location.state || {}; // Destructure the state to get user and selectedItems

  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [error, setError] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false); // State to control popup visibility

  // Calculate total price of all selected items
  const calculateTotal = () => {
    return selectedItems
      .reduce((total, item) => total + item.quantity * item.bookId.price, 0)
      .toFixed(2);
  };

  const handleSubmit = async () => {
    if (!address || !phoneNumber) {
      setError('Please fill in all required fields.');
      return;
    }
  
    const shippingInfo = { address, phoneNumber };
    const shippingFee = 10; // Example shipping fee
  
    const totalAmount = selectedItems.reduce((total, item) => {
      const itemSubtotal = item.quantity * item.bookId.price;
      return total + itemSubtotal;
    }, 0) + shippingFee;
  
    try {
      // Send the order data
      await axios.post('http://localhost:5000/api/v1/orders', {
        userId: user._id,
        items: selectedItems.map(item => ({
          bookId: item.bookId._id,
          quantity: item.quantity,
          price: item.bookId.price,
          subtotal: item.quantity * item.bookId.price,
        })),
        shippingInfo,
        paymentMethod,
        shippingFee,
        totalAmount: totalAmount.toFixed(2),
      });
  
      // Show success dialog
      setOpenSuccessDialog(true);
    } catch (err) {
      setError('Failed to process the order. Please try again.');
      console.error('Order error:', err.response?.data);
    }
  };
  

  const handleCloseDialog = () => {
    setOpenSuccessDialog(false); // Close the dialog
    navigate('/dashboard'); // Redirect to dashboard
  };

  return (
    <div style={{ padding: '20px' }}>
        <Navbar />
      <h2>Checkout</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>Order Summary</Typography>
        {selectedItems.map((item, index) => {
          const book = item.bookId || {}; // Handle undefined bookId
          const itemSubtotal = item.quantity * book.price;
          return (
            <Box key={index} mb={2}>
              <Typography variant="body1">
                <strong>{book.title || 'Unknown Book'}</strong>
              </Typography>
              
                <Typography variant="body2"  >Quantity: {item.quantity}</Typography>
                <Typography variant="body2" >Price: {book.price ? book.price.toFixed(2) : '0.00'}</Typography>
              <Typography variant="body2" >Subtotal: {itemSubtotal.toFixed(2)}</Typography>
            </Box>
          );
        })}
        <Stack direction="row" justifyContent="space-between" spacing={2} mt={2}>
          <Typography variant="h6">Subtotal</Typography>
          <Typography variant="h6">{calculateTotal()}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={2} mt={1}>
          <Typography variant="h6">Shipping Fee</Typography>
          <Typography variant="h6">10.00</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={2} mt={1}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">{(parseFloat(calculateTotal()) + 10).toFixed(2)}</Typography>
        </Stack>
      </Paper>

      <TextField
        label="Address"
        variant="outlined"
        fullWidth
        margin="normal"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <FormControl component="fieldset" style={{ marginTop: '20px' }}>
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup
          row
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
          <FormControlLabel value="Gcash" control={<Radio />} label="Gcash" />
          <FormControlLabel value="Maya" control={<Radio />} label="Maya" />
        </RadioGroup>
      </FormControl>
        <br></br>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={handleSubmit}
      >
        Confirm Order
      </Button>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
        <DialogTitle>Order Success</DialogTitle>
        <DialogContent>
          <p>Your order has been placed successfully!</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Checkout;
