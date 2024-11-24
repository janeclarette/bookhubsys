// backend/controllers/order.js
const Order = require('../models/order');
const Cart = require('../models/cart');

exports.createOrder = async (req, res) => {
    const { userId, items, shippingInfo, paymentMethod, shippingFee } = req.body;
  
    try {
      console.log('Request body:', req.body); // Log the incoming request body
  
      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, shippingFee);
  
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
        cart.items = cart.items.filter(cartItem => !items.some(orderItem => cartItem.bookId.toString() === orderItem.bookId));
        await cart.save();
      }
  
      res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
    } catch (err) {
      console.error('Error processing order:', err.message); // Log the error message
      res.status(500).json({ success: false, message: 'Failed to place order', error: err.message });
    }
  };
  

