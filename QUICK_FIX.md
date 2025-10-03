# Quick Fix for MongoDB Connection

## The Problem
Your backend server is failing to connect to MongoDB with the error:
```
❌ MongoDB connection error: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"
```

## Solution Options

### Option 1: Install Local MongoDB (Recommended)

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download the Windows MSI installer
   - Install with default settings

2. **Start MongoDB Service:**
   ```bash
   net start MongoDB
   ```

3. **Update your .env file:**
   ```
   MONGO_URI=mongodb://localhost:27017/furniture-shop
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start your backend:**
   ```bash
   cd backend
   npm start
   ```

### Option 2: Fix MongoDB Atlas Connection

1. **Check your Atlas cluster:**
   - Go to https://cloud.mongodb.com
   - Make sure your cluster is running
   - Check if your IP is whitelisted

2. **Update .env file with proper escaping:**
   ```
   MONGO_URI="mongodb+srv://akashiv890_db_user:qXLhFdrdJI4JiKIy@furniture-shop.wsz2k9j.mongodb.net/?retryWrites=true&w=majority&appName=Furniture-Shop"
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

### Option 3: Use MongoDB Atlas with New Connection String

1. **Get a new connection string from Atlas:**
   - Go to your cluster
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

2. **Update .env file:**
   ```
   MONGO_URI="your-new-connection-string-here"
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

## Quick Test

After setting up MongoDB, test the connection:

```bash
# Test local MongoDB
node test-local-mongodb.js

# Test Atlas MongoDB
node test-atlas-direct.js
```

## Start the Application

```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
cd frontend
npm run dev
```

## Expected Output

When working correctly, you should see:
```
✅ Connected to Database
Server is running 5000
```

## Troubleshooting

- **MongoDB not found**: Install MongoDB Community Server
- **Connection refused**: Start MongoDB service with `net start MongoDB`
- **Authentication failed**: Check your Atlas credentials
- **Network access denied**: Whitelist your IP in Atlas

Choose the option that works best for you. Local MongoDB is easier for development, while Atlas is better for production.
