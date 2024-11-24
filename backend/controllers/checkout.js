// backend/controllers/checkout.js
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getSelectedItems = async (req, res) => {
  try {
    const { userId, selectedItems } = req.body;

    // Fetch selected items from the cart
    const cart = await Cart.findOne({ userId }).populate('items.bookId');

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const selectedCartItems = cart.items.filter(item =>
      selectedItems.includes(item.bookId._id.toString())
    );

    res.status(200).json({ selectedItems: selectedCartItems });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch selected items', error });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { userId, selectedItems, shippingInfo, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Filter and extract selected items
    const selectedCartItems = cart.items.filter(item =>
      selectedItems.includes(item.bookId.toString())
    );

    const totalAmount = selectedCartItems.reduce(
      (total, item) => total + item.quantity * item.bookId.price, 0
    );

    const shippingFee = 50; // Flat rate for example

    // Create the order
    const newOrder = new Order({
      userId,
      items: selectedCartItems.map(item => ({
        bookId: item.bookId,
        quantity: item.quantity,
        price: item.bookId.price
      })),
      shippingInfo,
      paymentMethod,
      shippingFee,
      totalAmount: totalAmount + shippingFee
    });

    await newOrder.save();

    // Remove selected items from cart
    cart.items = cart.items.filter(
      item => !selectedItems.includes(item.bookId.toString())
    );
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error });
  }
};
