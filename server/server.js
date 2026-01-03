import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import testRoutes from "./routes/testRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://expo-ai-tau.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expoai';

connectDB(MONGO_URI);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/quiz', quizRoutes);

// Health Check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Expo AI Backend Running" });
});
// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));