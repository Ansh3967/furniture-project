import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const testConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/furniture-shop';
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('📍 URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in output
    
    await mongoose.connect(mongoUri);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if MongoDB service is started: net start MongoDB');
    console.log('3. Or start MongoDB manually: mongod --dbpath C:\\data\\db');
    console.log('4. Verify the MONGO_URI in your .env file');
    process.exit(1);
  }
};

testConnection();
