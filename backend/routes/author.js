const express = require('express');
const {
    createAuthor,
    getAuthors,
    getSingleAuthor,
    updateAuthor,
    deleteAuthor
} = require('../controllers/author');
const multer = require('multer');

const router = express.Router();


const upload = multer({ dest: 'uploads/' }); 

router.route('/')
    .post(upload.array('images', 10), createAuthor) 
    .get(getAuthors);

router.route('/:id')
    .get(getSingleAuthor)
    .put(upload.array('images', 10), updateAuthor) 
    .delete(deleteAuthor);

module.exports = router;
