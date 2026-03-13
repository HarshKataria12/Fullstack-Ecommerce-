// controllers/productController.js
const pool = require('../db');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// create a new product
exports.createProduct = async (req, res) => {
    const { name, description, price, stock_quantity, image_url } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Products (name, description, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity, image_url]
        );
        res.status(201).json({ id: result.insertId, name, description, price, stock });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};  
module.exports = {
    getAllProducts: exports.getAllProducts,
    createProduct: exports.createProduct
};