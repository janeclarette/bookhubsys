const express = require('express');
const {
    createSupplier,
    getSuppliers,
    getSingleSupplier,
    updateSupplier,
    deleteSupplier
} = require('../controllers/supplier');
const multer = require('multer');

const router = express.Router();


const upload = multer({ dest: 'uploads/' }); 

router.route('/')
    .post(upload.array('images', 10), createSupplier) 
    .get(getSuppliers);

router.route('/:id')
    .get(getSingleSupplier)
    .put(upload.array('images', 10), updateSupplier) 
    .delete(deleteSupplier);

module.exports = router;
