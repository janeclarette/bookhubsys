// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/order');

const { getAllOrders, updateOrderStatus } = require('../controllers/order');
const { isAdmin } = require('../middlewares/auth');


// Admin routes
router.get('/admin/orders', getAllOrders); // Admin can get all orders
router.put('/admin/orders/update-status', updateOrderStatus); // Admin can update the order status


router.post('/', createOrder);

module.exports = router;
