const express = require('express');
const {
    createGenre,
    getGenres,
    getSingleGenre,
    updateGenre,
    deleteGenre
} = require('../controllers/genre');
const router = express.Router();

router.route('/')
    .post(createGenre)
    .get(getGenres);

router.route('/:id')
    .get(getSingleGenre)
    .put(updateGenre)
    .delete(deleteGenre);

module.exports = router;
