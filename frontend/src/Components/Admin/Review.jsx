import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import Sidebar from './Sidebar';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null); // ID of the review to delete

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/reviews', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        setReviews(response.data.reviews);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
  
    fetchReviews();
  }, []);
  

  const handleDeleteConfirm = (reviewId) => {
    setReviewToDelete(reviewId);
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/reviews/${reviewToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setReviews(reviews.filter((review) => review._id !== reviewToDelete)); // Update state
      setOpenDialog(false); // Close the dialog
      setReviewToDelete(null);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setReviewToDelete(null);
  };

  const columns = [
    {
      name: 'bookId',
      label: 'Book',
      options: {
        customBodyRender: (value) => (value?.title ? value.title : 'N/A'),
      },
    },
    {
      name: 'userId',
      label: 'User',
      options: {
        customBodyRender: (value) => (value?.name ? value.name : 'N/A'),
      },
    },
    {
      name: 'rating',
      label: 'Rating',
    },
    {
      name: 'comment',
      label: 'Comment',
    },
    {
      name: 'createdAt',
      label: 'Date',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString(),
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteConfirm(reviews[tableMeta.rowIndex]._id)} // Open confirmation dialog
          >
            Delete
          </Button>
        ),
      },
    },
  ];

  const options = {
    selectableRows: 'none',
    responsive: 'standard',
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar onHoverChange={setSidebarHovered} />
      <Box
        style={{
          marginLeft: isSidebarHovered ? '250px' : '60px',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          width: '100%',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h4" sx={{ fontFamily: 'Fjalla One, sans-serif', fontWeight: 'bold' }}>
              Reviews Management
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', marginTop: 1 }}>
              View and manage all user reviews for books.
            </Typography>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <MUIDataTable title="Review List" data={reviews} columns={columns} options={options} />
        </TableContainer>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Review;