const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Verify JWT Token
const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied: No Token Provided');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};


const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).send('Access Denied: Admins Only');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports = { authenticate, isAdmin };
