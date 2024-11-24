const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')
const upload = require("../utils/multer");

exports.registerUser = async (req, res, next) => {
    try {
        // Ensure the file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        const { name, email, password } = req.body;

        // Create user in the database
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        // Generate and send a token with the response
        sendToken(user, 200, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password are entered by the user
    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' });
    }

    try {
        // Finding user in database
        let user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        // Check if the user is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account has been deactivated. Please contact support for assistance.' });
        }

        // Checks if the password is correct
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        // Generate token and send response
        sendToken(user, 200, res);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    return res.status(200).json({
        success: true,
        user
    })
}

exports.updateProfile = async (req, res, next) => {
   console.log(req.body.email)
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar
    if (req.body.avatar !== '') {
        let user = await User.findById(req.user.id)
        // console.log(user)
        const image_id = user.avatar.public_id;
        // const res = await cloudinary.v2.uploader.destroy(image_id);
        // console.log("Res", res)
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        },  (err, res) => {
            console.log(err, res);
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    })
    if (!user) {
        return res.status(401).json({ message: 'User Not Updated' })
    }

    return res.status(200).json({
        success: true
    })
}

exports.updatePassword = async (req, res, next) => {
    console.log(req.body.password)
    const user = await User.findById(req.user.id).select('+password');
    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return res.status(400).json({ message: 'Old password is incorrect' })
    }
    user.password = req.body.password;
     await user.save();
    // const token = user.getJwtToken();

    //  return res.status(201).json({
    //  	success:true,
    //     user,
    //  	token
    //  });
    sendToken(user, 200, res)

}

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User not found with this email' })
       
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://localhost:5173/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        return res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })
     
    }
}

exports.resetPassword = async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has been expired' })
       
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Password does not match' })
      
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    // const token = user.getJwtToken();

    //  return res.status(201).json({
    //  	success:true,
    //     user,
    //  	token
    //  });
    sendToken(user, 200, res)
}

exports.allUsers = async (req, res, next) => {
    const users = await User.find();
    if (!users) {
        return res.status(400).json({ error: 'no users found' })
    }
    
    return res.status(200).json({
        success: true,
        users
    })
}

exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({ message: `User does not found with id: ${req.params.id}` })
       
    }

    return res.status(200).json({
        success: true,
        user
    })
}

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        // useFindAndModify: false
    })

    if (!user) {
        return res.status(400).json({ message: `User not updated ${req.params.id}` })
       
    }


    return res.status(200).json({
        success: true
    })
}

exports.registerAdmin = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file to Cloudinary for avatar
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        const { name, email, password } = req.body;

        // Create admin user in the database (setting role to 'admin')
        const admin = await User.create({
            name,
            email,
            password,
            role: 'admin', // Explicitly setting the role as admin
            avatar: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        sendToken(admin, 200, res); // Generate JWT token and send the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Fetch Admin Profile
exports.getAdminProfile = async (req, res) => {
    const admin = await User.findById(req.user.id); // Assuming req.user contains the authenticated user
    if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ name: admin.name, email: admin.email });
};


// Admin Login
exports.loginAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' });
    }

    let admin = await User.findOne({ email }).select('+password');
    if (!admin) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    const isPasswordMatched = await admin.comparePassword(password);

    if (!isPasswordMatched) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    if (admin.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    sendToken(admin, 200, res); // Generate JWT token and send the response
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleUserActiveStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({ success: true, isActive: user.isActive });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
