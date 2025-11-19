import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export const protect = async (req, res, next) => {
    try {
        let token = null;
        // check cookie or header
        if (req.cookies && req.cookies.token) token = req.cookies.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ message: 'Not authorized' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash');
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
