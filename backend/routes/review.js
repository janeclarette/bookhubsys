const express = require('express');
const { addReview , getReviewById, updateReview, deleteReview } = require('../controllers/review'); // Import the controller function
const { isAuthenticatedUser } = require('../middlewares/auth'); // Middleware for authentication
const Review = require('../models/review');  

const router = express.Router();

// Delegate logic to the controller
router.post('/', isAuthenticatedUser, addReview);

router.get('/', async (req, res) => {
    try {
      const reviews = await Review.find().populate('orderId userId'); // Adjust the populate based on your schema
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews' });
    }
  });


router.get('/:id', isAuthenticatedUser, getReviewById); // Use the review ID as a parameter
router.put('/:id', isAuthenticatedUser, updateReview); // Update review by orderId

router.delete('/:id', deleteReview);


module.exports = router;
