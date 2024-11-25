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
  
      const review = await Review.create({
        orderId,
        userId: req.user.id,
        rating,
        comment,
      });
  
      res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (err) {
      console.error('Error adding review:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
