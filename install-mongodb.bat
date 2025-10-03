@echo off
echo ========================================
echo MongoDB Installation and Setup Script
echo ========================================

echo.
echo Step 1: Downloading MongoDB Community Server...
echo Please download MongoDB Community Server from:
echo https://www.mongodb.com/try/download/community
echo.
echo Choose:
echo - Version: 7.0 or latest
echo - Platform: Windows
echo - Package: MSI
echo.

echo Step 2: Installation Instructions...
echo 1. Run the downloaded MSI file
echo 2. Choose "Complete" installation
echo 3. Install MongoDB Compass (recommended)
echo 4. Choose "Run service as Network Service user"
echo 5. Install MongoDB as a Service
echo 6. Install MongoDB Compass
echo.

echo Step 3: After installation, run these commands:
echo net start MongoDB
echo.

echo Step 4: Create data directory...
if not exist "C:\data\db" (
    mkdir "C:\data\db"
    echo Created C:\data\db directory
) else (
    echo C:\data\db directory already exists
)

echo.
echo Step 5: Starting MongoDB service...
net start MongoDB

echo.
echo Step 6: Testing MongoDB connection...
echo Testing if MongoDB is running...
mongod --version

echo.
echo Step 7: Starting the backend server...
cd backend
npm start

pause
