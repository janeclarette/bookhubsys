// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateQuantity, bulkDelete } = require('../controllers/cart');

router.post('/', addToCart);
router.get('/', getCart);
router.get('/:userId', getCart);  // In cartRoutes.js
router.patch('/quantity', updateQuantity); // Update quantity
router.delete('/bulk-delete', bulkDelete); // Bulk delete items





module.exports = router;
