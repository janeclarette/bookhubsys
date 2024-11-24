// controller/cart.js

const Cart = require('../models/cart'); // Assuming you have a Cart model
const User = require('../models/user');
const { checkout } = require('./checkout'); 

const addToCart = async (req, res) => {
    try {
      const { userId, bookId } = req.body;
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      // Add the book to the cart (check if it already exists)
      const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
  
      if (itemIndex > -1) {
        // Item exists, update quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // Item doesn't exist, add it
        cart.items.push({ bookId, quantity: 1 });
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      console.error('Error adding item to cart:', error); // Add this log for debugging
      res.status(500).json({ message: 'Error adding item to cart' });
    }
  };
  

  const getCart = async (req, res) => {
    try {
      const { userId } = req.params;
      // Find the cart for the user
      const cart = await Cart.findOne({ userId })
        .populate('items.bookId')  // Populate the book details for each item
        .exec();  // Use exec for better error handling and performance
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for the user' });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Error fetching cart' });
    }
  };

  
  const removeFromCart = async (req, res) => {
    try {
      const { userId, bookId } = req.params;
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for the user' });
      }
  
      cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ message: 'Error removing item from cart' });
    }
  };
  
  const updateQuantity = async (req, res) => {
    try {
      const { userId, bookId, quantity } = req.body;
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return res.status(200).json(cart);
      }
  
      res.status(404).json({ message: 'Item not found in cart' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating quantity' });
    }
  };
  
  const bulkDelete = async (req, res) => {
    try {
      const { userId, bookIds } = req.body; // Array of book IDs to delete
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      cart.items = cart.items.filter(item => !bookIds.includes(item.bookId.toString()));
      await cart.save();
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting items from cart' });
    }
  };
  

  
  module.exports = { addToCart, getCart, updateQuantity, removeFromCart, bulkDelete, checkout  };