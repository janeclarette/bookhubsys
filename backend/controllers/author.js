const Author = require('../models/author');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();


const uploadImages = async (images) => {
    const uploadPromises = images.map(image => cloudinary.uploader.upload(image.path, {
        folder: 'authors' 
    }));
    return Promise.all(uploadPromises); 
};

exports.getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json({ success: true, authors });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error loading authors' });
    }
};

exports.getSingleAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ success: false, message: 'Author not found' });
        res.status(200).json({ success: true, author });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error loading author' });
    }
};

exports.createAuthor = async (req, res) => {
    try {
        let imagePaths = []; 

       
        if (req.files) {
            const uploadedImages = await uploadImages(req.files.map(file => ({ path: file.path })));
            imagePaths = uploadedImages.map(image => image.secure_url); 
        }

        const author = await Author.create({
            ...req.body,
            imagePath: imagePaths
        });

        res.status(201).json({ success: true, author });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Author creation failed' });
    }
};

exports.updateAuthor = async (req, res) => {
    try {
        let author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

        
        if (req.files) {
            const uploadedImages = await uploadImages(req.files.map(file => ({ path: file.path })));
            req.body.imagePath = uploadedImages.map(image => image.secure_url); 
        }

        author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, author });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Author update failed' });
    }
};

exports.deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

        res.status(200).json({ success: true, message: 'Author deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Author deletion failed' });
    }
};
