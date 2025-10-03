@echo off
echo Setting up Local MongoDB for Furniture Shop...

echo.
echo 1. Installing MongoDB Community Server...
echo Please download and install MongoDB Community Server from:
echo https://www.mongodb.com/try/download/community
echo.
echo 2. After installation, start MongoDB service:
echo net start MongoDB
echo.
echo 3. Or start MongoDB manually:
echo mongod --dbpath C:\data\db
echo.
echo 4. Create data directory if it doesn't exist:
if not exist "C:\data\db" mkdir "C:\data\db"

echo.
echo 5. Updating .env file to use local MongoDB...
cd backend
echo MONGO_URI=mongodb://localhost:27017/furniture-shop > .env
echo PORT=5000 >> .env
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production >> .env
echo NODE_ENV=development >> .env

echo.
echo 6. Starting backend server...
npm start

pause
