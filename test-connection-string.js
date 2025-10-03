// Test MongoDB connection string format
const connectionString = 'mongodb+srv://akashiv890_db_user:qXLhFdrdJI4JiKIy@furniture-shop.wsz2k9j.mongodb.net/?retryWrites=true&w=majority&appName=Furniture-Shop';

console.log('Testing MongoDB connection string format...');
console.log('Connection string:', connectionString);

// Check if it starts with the correct scheme
if (connectionString.startsWith('mongodb://') || connectionString.startsWith('mongodb+srv://')) {
    console.log('✅ Connection string format is correct');
} else {
    console.log('❌ Connection string format is incorrect');
}

// Test with mongoose
import mongoose from 'mongoose';

const testConnection = async () => {
    try {
        console.log('🔗 Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(connectionString);
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📊 Available collections:', collections.map(c => c.name));
        
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

testConnection();
