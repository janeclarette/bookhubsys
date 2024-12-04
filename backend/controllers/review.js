// controllers/reviewController.js
const Review = require('../models/review');
const Order = require('../models/order');

exports.addReview = async (req, res) => {
  try {
      const { orderId, rating, comment } = req.body;

      if (!orderId || !rating || !comment) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      if (order.userId.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Unauthorized to review this order' });
      }

      if (order.orderStatus !== 'Delivered') {
          return res.status(400).json({ message: 'Only delivered orders can be reviewed' });
      }

      // Assuming the order.items array contains book details
      const bookId = order.items[0].bookId; // Get the bookId from the first item in the order

      const review = await Review.create({
          orderId,
          userId: req.user.id,
          bookId, // Include the bookId here
          rating,
          comment,
      });

      res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
      console.error('Error adding review:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


  // Get a review by orderId
exports.getReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findOne({ orderId: id }).populate('orderId userId');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ review });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findOne({ orderId: id });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is authorized to update this review
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }

    // Update the review
    review.rating = rating !== undefined ? rating : review.rating;
    review.comment = comment !== undefined ? comment : review.comment;

    await review.save();

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// controllers/reviewController.js
exports.deleteReview = async (req, res) => {
  const { id } = req.params; // The review ID to delete

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Use deleteOne to delete the review
    await review.deleteOne(); 

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

