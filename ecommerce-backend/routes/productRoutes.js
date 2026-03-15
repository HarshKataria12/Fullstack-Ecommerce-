// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');

// Route for getting all products and creating a new product
router.route('/')
    .get(getProducts)
    .post(createProduct);

// Route for getting a single product by its ID
router.route('/:id')
    .get(getProductById);

module.exports = router;