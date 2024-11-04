const Supplier = require('../models/supplier');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

const uploadImages = async (images) => {
    const uploadPromises = images.map(image => cloudinary.uploader.upload(image.path, {
        folder: 'suppliers' 
    }));
    return Promise.all(uploadPromises); 
};

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json({ success: true, suppliers });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error loading suppliers' });
    }
};

exports.getSingleSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
        res.status(200).json({ success: true, supplier });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error loading supplier' });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        let imagePaths = []; 

        
        if (req.files) {
            const uploadedImages = await uploadImages(req.files.map(file => ({ path: file.path })));
            imagePaths = uploadedImages.map(image => image.secure_url); // Get the image URLs
        }

        const supplier = await Supplier.create({
            ...req.body,
            imagePath: imagePaths 
        });

        res.status(201).json({ success: true, supplier });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Supplier creation failed' });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        let supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

        
        if (req.files) {
            const uploadedImages = await uploadImages(req.files.map(file => ({ path: file.path })));
            req.body.imagePath = uploadedImages.map(image => image.secure_url); 
        }

        supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, supplier });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Supplier update failed' });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

        res.status(200).json({ success: true, message: 'Supplier deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Supplier deletion failed' });
    }
};
