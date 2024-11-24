const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { registerUser, 
    loginUser,
    getUserProfile,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    allUsers,
    getUserDetails,
    updateUser,
    registerAdmin, 
    loginAdmin,
    getAdminProfile, 
} = require('../controllers/auth');
    const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


const { getAllUsers, toggleUserActiveStatus } = require('../controllers/auth.js');

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.get('/me', isAuthenticatedUser, getUserProfile)
router.put('/me/update', isAuthenticatedUser,  upload.single("avatar"), updateProfile)
router.put('/password/update', isAuthenticatedUser, updatePassword)
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

// Admin Routes
router.post('/register/admin', upload.single('avatar'), registerAdmin); // Admin register route
router.post('/login/admin', loginAdmin); 
router.get('/admin/profile', isAuthenticatedUser, getAdminProfile)
router.get('/admin/users', allUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser,  getUserDetails).put(isAuthenticatedUser, updateUser)


router.get('/admin/users', getAllUsers);
router.patch('/admin/users/:userId/activate', toggleUserActiveStatus);

module.exports = router;