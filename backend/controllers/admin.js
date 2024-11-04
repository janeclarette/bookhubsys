const User = require('../models/user');

// CRUD Operations for Admins Only
exports.createUser = async (req, res) => {
    try {
        const { email, password, name, address, phoneNumber } = req.body;
        const user = new User({ email, password, name, address, phoneNumber });

        await user.save();
        res.status(201).send('User Created');
    } catch (err) {
        res.status(500).send('Error Creating User');
    }
};

// Other CRUD methods like updateUser, deleteUser, getUser can be defined here similarly with admin checks.
