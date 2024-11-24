// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/order');

router.post('/', createOrder);

module.exports = router;
