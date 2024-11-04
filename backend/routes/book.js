const express = require('express');
const {
    createBook,
    getBooks,
    getSingleBook,
    updateBook,
    deleteBook
} = require('../controllers/book');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.route('/')
    .post(upload.array('images', 10), createBook) 
    .get(getBooks);

router.route('/:id')
    .get(getSingleBook)
    .put(upload.array('images', 10), updateBook) 
    .delete(deleteBook);

module.exports = router;
