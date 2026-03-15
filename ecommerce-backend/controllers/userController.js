// controllers/userController.js
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate a JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Check if user already exists
        const [userExists] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert user into database
        const [result] = await pool.query(
            'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // 4. Send back the new user data and token
        res.status(201).json({
            id: result.insertId,
            name,
            email,
            token: generateToken(result.insertId)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during registration' });
    }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by email
        const [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // 2. Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Send back user data and token
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during login' });
    }
};

// This is the line that Express was crying about!
module.exports = { registerUser, loginUser };