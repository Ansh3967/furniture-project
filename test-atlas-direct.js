import mongoose from 'mongoose';

const testAtlasConnection = async () => {
  try {
    const mongoUri = 'mongodb+srv://akashiv890_db_user:qXLhFdrdJI4JiKIy@furniture-shop.wsz2k9j.mongodb.net/?retryWrites=true&w=majority&appName=Furniture-Shop';
    console.log('🔗 Attempting to connect to MongoDB Atlas...');
    console.log('📍 URI:', mongoUri.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(mongoUri);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
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
    console.log('🔌 Disconnected from MongoDB Atlas');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your MongoDB Atlas connection string');
    console.log('2. Verify your IP address is whitelisted in MongoDB Atlas');
    console.log('3. Check if your database user has proper permissions');
    console.log('4. Verify the database name in the connection string');
    process.exit(1);
  }
};

testAtlasConnection();
