import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
    
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection error:', error);
        // console.error('MongoDB connection failed:', error);
        // process.exit(1); // Exit the process with failure
    }

};