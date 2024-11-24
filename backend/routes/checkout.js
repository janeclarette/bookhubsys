// backend/routes/checkout.js
const express = require('express');
const router = express.Router();
const { getSelectedItems, placeOrder } = require('../controllers/checkout');

// Route to get selected items from cart
router.get('/selected-items', getSelectedItems);

// Route to place an order
router.post('/place-order', placeOrder);

module.exports = router;
