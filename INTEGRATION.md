# Frontend-Backend Integration Guide

## Overview
This document explains how the frontend and backend are integrated in the Furniture Shop application.

## Architecture
- **Frontend**: React + TypeScript + Vite (Port 8080)
- **Backend**: Node.js + Express + MongoDB (Port 5000)
- **API Base URL**: `http://localhost:5000/api`

## Integration Features

### 1. CORS Configuration
The backend is configured to accept requests from the frontend:
```javascript
app.use(cors({
  origin: "http://localhost:8080", // Frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

### 2. API Structure
All backend routes are prefixed with `/api`:
- User routes: `/api/user/*`
- Admin routes: `/api/admin/*`

### 3. Axios Configuration
The frontend uses a configured axios instance with:
- Automatic token injection
- Error handling for 401 responses
- Base URL configuration

### 4. Service Layer
Created service files for clean API communication:
- `authService.ts` - Authentication operations
- `itemService.ts` - Item management
- `categoryService.ts` - Category management
- `reviewService.ts` - Review operations

## Running the Application

### Option 1: Use the Batch Script (Windows)
```bash
./start-dev.bat
```

### Option 2: Manual Start
1. Start Backend:
```bash
cd backend
npm run dev
```

2. Start Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

## Testing Integration

1. Navigate to `http://localhost:8080/test`
2. Click "Test Items API" to test basic connectivity
3. Click "Test Auth API" to test authentication endpoints

## API Endpoints

### Authentication
- `POST /api/user/auth/login` - User login
- `POST /api/user/auth/register` - User registration
- `GET /api/user/auth/profile` - Get user profile
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/register` - Admin registration

### Items
- `GET /api/user/item/list` - Get all items
- `POST /api/user/item/get` - Get item by ID
- `POST /api/admin/item/add` - Create item (admin)
- `POST /api/admin/item/edit` - Update item (admin)
- `POST /api/admin/item/remove` - Delete item (admin)

### Categories
- `GET /api/admin/category/list` - Get all categories
- `POST /api/admin/category/add` - Create category (admin)
- `POST /api/admin/category/edit` - Update category (admin)
- `POST /api/admin/category/remove` - Delete category (admin)

### Reviews
- `GET /api/user/review/item/:itemId` - Get item reviews
- `POST /api/user/review/add` - Create review
- `POST /api/user/review/edit` - Update review
- `POST /api/user/review/remove` - Delete review

## Environment Configuration

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/furniture-shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Frontend
The frontend automatically connects to `http://localhost:5000/api`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend is running on port 5000
2. **Connection Refused**: Ensure MongoDB is running
3. **404 Errors**: Check that the API routes are properly prefixed with `/api`

### Debug Steps

1. Check if both servers are running:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:8080`

2. Test API directly:
   ```bash
   curl http://localhost:5000/api/user/item/list
   ```

3. Check browser network tab for request details

## Next Steps

1. Implement authentication state management
2. Add error boundaries for better error handling
3. Implement loading states
4. Add form validation
5. Implement file upload for images
