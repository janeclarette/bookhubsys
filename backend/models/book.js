const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter book title'],
        trim: true,
        maxLength: [200, 'Title cannot exceed 200 characters']
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: [true, 'Please provide an author ID']
    },
    genreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: [true, 'Please provide a genre ID']
    },
    publicationDate: {
        type: Date,
        required: [true, 'Please enter publication date']
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock level'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'Please provide supplier ID']
    },
    images: [{ 
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Book', bookSchema);
