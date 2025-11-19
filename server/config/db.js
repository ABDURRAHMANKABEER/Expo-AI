import mongoose from 'mongoose';

const connectDB = async (mongoUri) => {
    try {
        await mongoose.connect(mongoUri, {
          dbName: "Expo_AI",
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      );
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

export default connectDB;