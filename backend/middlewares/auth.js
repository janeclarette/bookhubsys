const User = require('../models/user')
const jwt = require("jsonwebtoken")

exports.isAuthenticatedUser = async (req, res, next) => {
  // Check token in Authorization header first
  let token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  // If no token found in Authorization header, check cookies
  if (!token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Login first to access this resource' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
  

exports.authorizeRoles = (...roles) => {
	
    return (req, res, next) => {
        // console.log(roles, req.user, req.body);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message:`Role (${req.user.role}) is not allowed to acccess this resource`})
          
        }
        next()
    }
}


exports.protect = async (req, res, next) => {
  let token;

  // Extract token from cookies
  if (req.cookies.token) {
    token = req.cookies.token; // Adjust based on cookie key
  }

  if (!token) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token. Please log in again.' });
  }
};