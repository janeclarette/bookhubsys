const express = require('express');
const {
    createBook,
    getBooks,
    getSingleBook,
    updateBook,
    deleteBook
} = require('../controllers/book');
const Book = require('../models/book'); // Import the Book model
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Routes for books CRUD operations
router.route('/')
    .post(upload.array('images', 10), createBook) // Create a book with image upload
    .get(getBooks); // Get all books

router.route('/:id')
    .get(getSingleBook) // Get a single book by ID
    .put(upload.array('images', 10), updateBook) // Update a book with image upload
    .delete(deleteBook); // Delete a book

// Route to get books by author ID
router.get('/author/:authorId', async (req, res) => {
    try {
        const { authorId } = req.params;
        const books = await Book.find({ authorId }).populate('authorId', 'name'); // Populate author name if needed
        res.status(200).json({ success: true, books });
    } catch (error) {
        console.error('Error fetching books by author:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
