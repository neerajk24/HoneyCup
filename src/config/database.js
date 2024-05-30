// HoneyCup/src/config/database.js
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import { publicIpv4 } from 'public-ip';

dotenv.config();

const connectDatabase = async () => {
    const dbUri = process.env.MONGODB_URI; // mongodb://localhost:27017/honeyCup

    try {
        const ip = await publicIpv4();
        console.log('Connecting to MongoDB at:', dbUri);
        console.log('Attempting to connect from IP:', ip);

        await connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDatabase;
