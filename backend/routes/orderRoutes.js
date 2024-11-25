// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/order');

const { getAllOrders, updateOrderStatus } = require('../controllers/order');
const { getMonthlySales } = require('../controllers/order'); // Adjust the path as needed
const {  getUserOrders } = require('../controllers/order');
const { isAdmin } = require('../middlewares/auth');
const { protect } = require('../middlewares/auth');

// Admin routes
router.get('/admin/orders', getAllOrders); // Admin can get all orders
router.put('/admin/orders/update-status', updateOrderStatus); // Admin can update the order status



router.post('/', createOrder);

router.get('/', protect, getUserOrders);


router.get('/monthly-sales', getMonthlySales);

module.exports = router;
