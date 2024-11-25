const express = require('express');
const { addReview } = require('../controllers/review'); // Import the controller function
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

module.exports = router;
