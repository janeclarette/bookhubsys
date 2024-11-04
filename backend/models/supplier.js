const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter supplier name'],
        trim: true,
        maxLength: [150, 'Supplier name cannot exceed 150 characters']
    },
    contactInfo: {
        type: String,
        required: [true, 'Please enter contact information']
    },
    address: {
        type: String,
        maxLength: [200, 'Address cannot exceed 200 characters']
    },
    imagePath: {
        type: [String], // Changed to an array to store multiple image URLs
        default: ['default.jpg']
    }
});

module.exports = mongoose.model('Supplier', supplierSchema);
