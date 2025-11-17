require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expoai';

connectDB(MONGO_URI);

// routes
app.use('/api/auth', authRoutes);

// health
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));