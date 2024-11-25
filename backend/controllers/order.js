// backend/controllers/order.js
const Order = require('../models/order');
const Cart = require('../models/cart');

exports.createOrder = async (req, res) => {
    const { userId, items, shippingInfo, paymentMethod, shippingFee, totalAmount } = req.body;
  
    try {
      console.log('Request body:', req.body); // Log the incoming request body
  
      // Validate input
      if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'No items to order.' });
      }
  
      // Create a new order
      const newOrder = new Order({
        userId,
        items,
        shippingInfo,
        paymentMethod,
        shippingFee,
        totalAmount,
      });
  
      await newOrder.save();
  
      // Remove ordered items from the cart
      const cart = await Cart.findOne({ userId });
      if (cart) {
        cart.items = cart.items.filter(
          cartItem => !items.some(orderItem => cartItem.bookId.toString() === orderItem.bookId)
        );
        await cart.save();
      }
  
      res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
    } catch (err) {
      console.error('Error processing order:', err.message); // Log the error message
      res.status(500).json({ success: false, message: 'Failed to place order', error: err.message });
    }
  };
  

  exports.getAllOrders = async (req, res) => {
    try {
      // Fetch all orders and populate book details for each item
      const orders = await Order.find()
        .populate('userId', 'name email') // Populate the user details (name, email)
        .populate('items.bookId', 'title price imagePath')  // Populate book details for each item
        .sort({ createdAt: -1 });  // Sort by creation date in descending order
  
      res.status(200).json({ success: true, orders });
    } catch (err) {
      console.error('Failed to fetch all orders:', err.message);
      res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
  };
  

  // Update the status of an order (admin can update order status)
exports.updateOrderStatus = async (req, res) => {
    try {
      const { orderId, status } = req.body;
  
      // Ensure the status is valid
      const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status provided.',
        });
      }
  
      // Find and update the order status
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found.',
        });
      }
  
      order.orderStatus = status;
      order.updatedAt = Date.now();
      await order.save();
  
      res.status(200).json({
        success: true,
        message: 'Order status updated successfully.',
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

exports.getOrdersByStatus = async (req, res) => {
    const { status } = req.query;
    const { userId } = req.user; 
  
    try {
      // Validate status
      const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status provided.',
        });
      }
  
      // Fetch orders by userId and status
      const orders = await Order.find({ userId, orderStatus: status })
        .populate('items.bookId', 'title price imagePath')
        .sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, orders });
    } catch (err) {
      console.error('Failed to fetch orders:', err.message);
      res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
  };

// Controller: Fetch orders for the logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.bookId', 'title price imagePath')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

exports.getMonthlySales = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Parse the startDate and endDate from the query parameters.
    const start = new Date(startDate); // Using the Date constructor for better date handling.
    const end = new Date(endDate);

    // Ensure the dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    // Ensure end date is inclusive of the whole day (set time to 23:59:59)
    end.setHours(23, 59, 59, 999);

    // Aggregate order data for monthly sales
    const salesData = await Order.aggregate([
      {
        $unwind: '$items',
      },
      {
        $match: {
          'items.bookId': { $ne: null }, // Ensure that bookId exists
          createdAt: { $gte: start, $lte: end }, // Match the date range
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            bookId: '$items.bookId',
          },
          totalSales: { $sum: '$items.subtotal' }, // Calculate the total sales for each book
        },
      },
      {
        $lookup: {
          from: 'books', // Reference the books collection
          localField: '_id.bookId',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      {
        $unwind: '$bookDetails',
      },
      {
        $project: {
          month: '$_id.month', // Correct field path
          year: '$_id.year', // Correct field path
          title: '$bookDetails.title',
          totalSales: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    res.status(200).json({ success: true, data: salesData });
  } catch (err) {
    console.error('Error fetching monthly sales:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching monthly sales' });
  }
};
