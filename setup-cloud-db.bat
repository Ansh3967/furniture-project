@echo off
echo ========================================
echo Cloud Database Setup (No Installation Required)
echo ========================================

echo.
echo Option 1: MongoDB Atlas (Free Cloud Database)
echo 1. Go to https://www.mongodb.com/cloud/atlas
echo 2. Create a free account
echo 3. Create a new cluster (free tier)
echo 4. Create a database user
echo 5. Whitelist your IP address (0.0.0.0/0 for all IPs)
echo 6. Get your connection string
echo.

echo Option 2: Using Railway (Alternative)
echo 1. Go to https://railway.app
echo 2. Create a free account
echo 3. Create a new MongoDB database
echo 4. Get your connection string
echo.

echo Option 3: Using MongoDB Atlas with your existing account
echo Your existing connection string:
echo mongodb+srv://akashiv890_db_user:qXLhFdrdJI4JiKIy@furniture-shop.wsz2k9j.mongodb.net/?retryWrites=true&w=majority&appName=Furniture-Shop
echo.

echo Let me fix the connection string format...
cd backend

echo MONGO_URI=mongodb+srv://akashiv890_db_user:qXLhFdrdJI4JiKIy@furniture-shop.wsz2k9j.mongodb.net/?retryWrites=true^&w=majority^&appName=Furniture-Shop > .env
echo PORT=5000 >> .env
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production >> .env
echo NODE_ENV=development >> .env

echo.
echo Updated .env file with properly escaped connection string
echo.

echo Starting backend server...
npm start

pause
