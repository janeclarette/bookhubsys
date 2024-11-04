const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter author name'],
        trim: true,
        maxLength: [150, 'Author name cannot exceed 150 characters']
    },
    bio: {
        type: String,
        maxLength: [1000, 'Bio cannot exceed 1000 characters']
    },
    imagePath: {
        type: [String], 
        default: ['default.jpg']
    }
});

module.exports = mongoose.model('Author', authorSchema);
