@echo off
echo ========================================
echo Furniture Shop - Quick Start
echo ========================================

echo.
echo Checking MongoDB installation...

:: Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB not found. Please install MongoDB Community Server first.
    echo.
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo ✅ MongoDB found!

echo.
echo Starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ MongoDB service might already be running or needs to be started manually
)

echo.
echo Setting up environment...
cd backend
echo MONGO_URI=mongodb://localhost:27017/furniture-shop > .env
echo PORT=5000 >> .env
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production >> .env
echo NODE_ENV=development >> .env

echo.
echo Starting backend server...
echo Backend will start on http://localhost:5000
echo.
start "Backend Server" cmd /k "npm start"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting frontend server...
echo Frontend will start on http://localhost:8080
echo.
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Press any key to exit...
pause >nul
