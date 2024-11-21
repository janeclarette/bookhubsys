const Book = require('../models/book');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();


const uploadImages = async (images) => {
    const imageUploadPromises = images.map(image => {
        return cloudinary.uploader.upload(image.path, {
            folder: 'book' 
        });
    });
    return Promise.all(imageUploadPromises);
};

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('authorId genreId supplierId');
        res.status(200).json({ success: true, books });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error loading books', error: error.message });
    }
};

exports.getSingleBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('authorId genreId supplierId');
        if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
        res.status(200).json({ success: true, book });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error loading book', error: error.message });
    }
};

exports.createBook = async (req, res) => {
    try {
        const uploadedImages = await uploadImages(req.files);

        const images = uploadedImages.map(image => ({
            public_id: image.public_id,
            url: image.secure_url
        }));

        const book = await Book.create({
            ...req.body,
            images
        });

        res.status(201).json({ success: true, book });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Book creation failed', error: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

        if (req.files) {
            const uploadedImages = await uploadImages(req.files.map(file => ({ path: file.path })));
            const newImages = uploadedImages.map(image => ({
                public_id: image.public_id,
                url: image.secure_url
            }));
            req.body.images = newImages;
        }

        // Ensure price is handled
        if (req.body.price !== undefined) {
            req.body.price = parseFloat(req.body.price);
        }

        book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.status(200).json({ success: true, book });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Book update failed', error: error.message });
    }
};



exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

        if (book.images) {
            const deletePromises = book.images.map(image => cloudinary.uploader.destroy(image.public_id));
            await Promise.all(deletePromises);
        }

        res.status(200).json({ success: true, message: 'Book deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Book deletion failed', error: error.message });
    }
};
