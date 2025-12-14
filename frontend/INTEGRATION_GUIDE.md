# Backend Integration Guide

This document explains how the frontend integrates with the backend API.

## API Contract

The frontend expects the following backend API structure:

### Authentication Endpoints

#### POST /api/auth/register
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/login
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Sweets Endpoints

#### GET /api/sweets
**Headers:** `Authorization: Bearer <token>`

**Expected Response:**
```json
[
  {
    "_id": "sweet_id",
    "name": "Gulab Jamun",
    "category": "Indian",
    "price": 50,
    "quantity": 100,
    "description": "Sweet milk dumplings"
  }
]
```

#### GET /api/sweets/search
**Query Parameters:**
- `name` (optional): Search by name
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price

**Expected Response:** Same as GET /api/sweets

#### POST /api/sweets (Admin Only)
**Request Body:**
```json
{
  "name": "Rasgulla",
  "category": "Indian",
  "price": 40,
  "quantity": 50,
  "description": "Spongy sweet balls"
}
```

**Expected Response:**
```json
{
  "_id": "new_sweet_id",
  "name": "Rasgulla",
  "category": "Indian",
  "price": 40,
  "quantity": 50,
  "description": "Spongy sweet balls"
}
```

#### PUT /api/sweets/:id (Admin Only)
**Request Body:** Same as POST /api/sweets

**Expected Response:** Updated sweet object

#### DELETE /api/sweets/:id (Admin Only)
**Expected Response:**
```json
{
  "message": "Sweet deleted successfully"
}
```

### Inventory Endpoints

#### POST /api/sweets/:id/purchase
**Request Body:**
```json
{
  "quantity": 1
}
```

**Expected Response:** Updated sweet object with decreased quantity

#### POST /api/sweets/:id/restock (Admin Only)
**Request Body:**
```json
{
  "quantity": 50
}
```

**Expected Response:** Updated sweet object with increased quantity

## JWT Token Requirements

The JWT token must contain the following payload structure:

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "user" | "admin",
  "exp": 1234567890
}
```

**Important:**
- The `role` field is used to determine admin access
- Token expiry (`exp`) is checked on the frontend
- Token must be sent in `Authorization: Bearer <token>` header format

## Error Response Format

All error responses should follow this format:

```json
{
  "message": "Error message here"
}
```

**HTTP Status Codes:**
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/expired token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## CORS Configuration

The backend must allow requests from:
- Development: `http://localhost:3000`
- Production: Configure based on your deployment URL

**Required Headers:**
- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Frontend Configuration

Update `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Or modify `vite.config.js` proxy settings if using Vite's proxy feature.

## Testing Integration

1. **Start Backend:** Ensure backend is running on port 5000
2. **Start Frontend:** Run `npm run dev`
3. **Test Flow:**
   - Register a new user
   - Login with credentials
   - View dashboard (should show sweets)
   - Test search functionality
   - Purchase a sweet (if logged in as user)
   - Access admin panel (if role is "admin")

## Common Issues

**CORS Errors:**
- Ensure backend CORS is configured correctly
- Check that frontend URL is whitelisted

**401 Unauthorized:**
- Verify token is being sent in Authorization header
- Check token format: `Bearer <token>`
- Ensure token hasn't expired

**Admin Features Not Showing:**
- Verify JWT payload contains `role: "admin"`
- Check token decoding in browser console
- Ensure AuthContext is reading role correctly

