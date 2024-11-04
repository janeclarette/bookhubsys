const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter genre name'],
        trim: true,
        maxLength: [100, 'Genre name cannot exceed 100 characters']
    }
});

module.exports = mongoose.model('Genre', genreSchema);
