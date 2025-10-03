import mongoose from 'mongoose';

const testLocalConnection = async () => {
  try {
    const mongoUri = 'mongodb://localhost:27017/furniture-shop';
    console.log('🔗 Attempting to connect to local MongoDB...');
    console.log('📍 URI:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Successfully connected to local MongoDB!');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test user collection
    const User = mongoose.model('User', new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      password: String,
      phone: String
    }));
    
    const userCount = await User.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from local MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Local MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if MongoDB service is started: net start MongoDB');
    console.log('3. Or start MongoDB manually: mongod --dbpath C:\\data\\db');
    console.log('4. Verify MongoDB is running on port 27017');
    process.exit(1);
  }
};

testLocalConnection();
