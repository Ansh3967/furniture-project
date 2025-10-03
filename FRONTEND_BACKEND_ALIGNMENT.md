# Frontend-Backend Data Alignment

## Overview
This document outlines the alignment between frontend services and backend database models to ensure data consistency and remove unwanted fields.

## Database Models vs Frontend Interfaces

### 1. User Model Alignment

**Backend User Model:**
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required),
  phone: String (required),
  timestamps: true
}
```

**Frontend User Interface:**
```typescript
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}
```

**Removed Fields:** username, profile images, address, preferences

### 2. Admin Model Alignment

**Backend Admin Model:**
```javascript
{
  username: String (required, unique),
  password: String (required),
  email: String (required, unique),
  isActive: Boolean (default: true),
  timestamps: true
}
```

**Frontend Admin Interface:**
```typescript
interface Admin {
  _id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Removed Fields:** profile images, permissions, roles

### 3. Item Model Alignment

**Backend Item Model:**
```javascript
{
  name: String (required),
  description: String (optional),
  categoryId: ObjectId (required, ref: Category),
  furnitureStatus: String (enum: ["in stock", "out of stock"]),
  saleType: String (enum: ["sale", "rent", "both"]),
  buyPrice: Number (optional),
  rentPrice: Number (optional),
  depositPrice: Number (optional),
  warranty: String (optional),
  mediaId: ObjectId (optional, ref: Media),
  timestamps: true
}
```

**Frontend Item Interface:**
```typescript
interface Item {
  _id: string;
  name: string;
  description?: string;
  categoryId: string;
  furnitureStatus: 'in stock' | 'out of stock';
  saleType: 'sale' | 'rent' | 'both';
  buyPrice?: number;
  rentPrice?: number;
  depositPrice?: number;
  warranty?: string;
  mediaId?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Removed Fields:** 
- images array (replaced with mediaId reference)
- stock number (replaced with furnitureStatus)
- features array
- dimensions object
- material, color, brand
- price (replaced with buyPrice/rentPrice)

### 4. Category Model Alignment

**Backend Category Model:**
```javascript
{
  name: String (required),
  timestamps: { createdAt: true, updatedAt: false }
}
```

**Frontend Category Interface:**
```typescript
interface Category {
  _id: string;
  name: string;
  createdAt: string;
}
```

**Removed Fields:** description, image, parent category, sort order

### 5. Review Model Alignment

**Backend Review Model:**
```javascript
{
  itemId: ObjectId (required, ref: Item),
  userId: ObjectId (required, ref: User),
  rating: Number (required, min: 1, max: 5),
  comment: String (optional),
  timestamps: true
}
```

**Frontend Review Interface:**
```typescript
interface Review {
  _id: string;
  itemId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Removed Fields:** helpful votes, verified purchase, images

### 6. Media Model Alignment

**Backend Media Model:**
```javascript
{
  type: String (required),
  url: String (required),
  fileSize: Number (required),
  userType: String (required),
  createdBy: String (required),
  timestamps: true
}
```

**Frontend Media Interface:**
```typescript
interface Media {
  _id: string;
  type: string;
  url: string;
  fileSize: number;
  userType: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

## Updated Service Methods

### AuthService Changes
- `userLogin()` - Updated to use UserLoginData interface
- `userRegister()` - Updated to use UserRegisterData interface
- `getUserProfile()` - Returns User interface
- `updateUserProfile()` - Uses Partial<UserRegisterData>
- `adminLogin()` - Updated to use AdminLoginData interface
- `adminRegister()` - Updated to use AdminRegisterData interface
- `getAdminProfile()` - Returns Admin interface
- `updateAdminProfile()` - Uses Partial<AdminRegisterData>

### ItemService Changes
- Updated Item interface to match backend model
- Removed unused fields (images, stock, features, dimensions, etc.)
- Added furniture-specific fields (saleType, buyPrice, rentPrice, etc.)

### CategoryService Changes
- Simplified Category interface (removed description)
- Updated CreateCategoryData interface

### ReviewService Changes
- Made comment optional to match backend
- Removed unused fields

### New MediaService
- Created complete media management service
- Matches backend Media model exactly

## Benefits of This Alignment

1. **Data Consistency**: Frontend interfaces exactly match backend models
2. **Reduced Complexity**: Removed unused fields and features
3. **Better Performance**: Smaller data payloads
4. **Easier Maintenance**: Single source of truth for data structure
5. **Type Safety**: Full TypeScript support with accurate interfaces

## Migration Notes

- All existing frontend components using old interfaces need to be updated
- Form components need to be updated to match new data structures
- API calls need to be updated to use new service methods
- Remove any references to removed fields in components

## Next Steps

1. Update all frontend components to use new interfaces
2. Update forms to match new data structures
3. Test all API integrations
4. Update documentation and user guides
