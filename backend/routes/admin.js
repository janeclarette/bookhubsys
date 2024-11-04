const express = require('express');
const { createUser } = require('../controllers/admin');
const { authenticate, isAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/user', authenticate, isAdmin, createUser);

module.exports = router;
