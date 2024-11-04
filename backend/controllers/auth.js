const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register User
exports.register = async (req, res) => {
    try {
        const { email, password, name, address, phoneNumber, role } = req.body;
        const user = new User({ email, password, name, address, phoneNumber, role });

        await user.save();

        res.status(201).send('User Registered');
    } catch (err) {
        res.status(500).send('Error Registering User');
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).send('Invalid Credentials');
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('Authorization', `Bearer ${token}`).send({ token });
    } catch (err) {
        res.status(500).send('Error Logging In');
    }
};

