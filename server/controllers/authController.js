require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, passwordHash });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(201).json({ user: { id: user._id, email: user.email, name: user.name }, token });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ user: { id: user._id, email: user.email, name: user.name }, token });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};
