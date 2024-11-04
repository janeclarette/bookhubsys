const Genre = require('../models/genre');

exports.getGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        res.status(200).json({ success: true, genres });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error loading genres' });
    }
};

exports.getSingleGenre = async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).json({ success: false, message: 'Genre not found' });
        res.status(200).json({ success: true, genre });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error loading genre' });
    }
};

exports.createGenre = async (req, res) => {
    try {
        const genre = await Genre.create(req.body);
        res.status(201).json({ success: true, genre });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Genre creation failed' });
    }
};

exports.updateGenre = async (req, res) => {
    try {
        let genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).json({ success: false, message: 'Genre not found' });

        genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, genre });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Genre update failed' });
    }
};

exports.deleteGenre = async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) return res.status(404).json({ success: false, message: 'Genre not found' });

        res.status(200).json({ success: true, message: 'Genre deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Genre deletion failed' });
    }
};
