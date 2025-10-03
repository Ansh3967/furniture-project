# Database Setup Guide

## Option 1: Local MongoDB (Recommended for Development)

### Step 1: Install MongoDB Community Server
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install it with default settings
3. Make sure to install MongoDB Compass (optional but helpful)

### Step 2: Start MongoDB Service
```bash
# Start MongoDB service
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

### Step 3: Update Environment Configuration
The backend is already configured to use local MongoDB. Your `.env` file should contain:
```
MONGO_URI=mongodb://localhost:27017/furniture-shop
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Step 4: Test Database Connection
```bash
node test-local-mongodb.js
```

### Step 5: Start the Application
```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
cd frontend
npm run dev
```

## Option 2: MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster

### Step 2: Configure Database Access
1. Go to Database Access
2. Create a database user
3. Set username and password

### Step 3: Configure Network Access
1. Go to Network Access
2. Add your IP address (or 0.0.0.0/0 for all IPs)
3. Whitelist the IP addresses

### Step 4: Get Connection String
1. Go to Clusters
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

### Step 5: Update .env File
Replace the MONGO_URI in your `.env` file with your Atlas connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

## Testing the Setup

### Test Database Connection
```bash
# For local MongoDB
node test-local-mongodb.js

# For Atlas MongoDB
node test-atlas-direct.js
```

### Test Authentication
1. Start the backend server
2. Visit http://localhost:8080/auth-test
3. Test user registration and login
4. Test admin registration and login

## Troubleshooting

### Common Issues:
1. **MongoDB not running**: Start the MongoDB service
2. **Connection refused**: Check if MongoDB is running on port 27017
3. **Authentication failed**: Check username/password in connection string
4. **Network access denied**: Whitelist your IP in MongoDB Atlas

### Useful Commands:
```bash
# Check if MongoDB is running
net start | findstr MongoDB

# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB

# Check MongoDB version
mongod --version
```

## Current Status
- ✅ Backend server configured
- ✅ Frontend configured
- ✅ Authentication endpoints working
- ⚠️ Database connection needs to be established

Choose either local MongoDB or MongoDB Atlas based on your preference. Local MongoDB is easier for development, while Atlas is better for production.
