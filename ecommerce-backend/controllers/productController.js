// controllers/productController.js
const pool = require('../db');

// @desc    Fetch all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM Products');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const [product] = await pool.query('SELECT * FROM Products WHERE id = ?', [req.params.id]);
        
        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
const createProduct = async (req, res) => {
    const { name, description, price, stock_quantity, image_url } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO Products (name, description, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity, image_url]
        );
        res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// The magical line that hands these functions over to the router!
module.exports = { getProducts, getProductById, createProduct };