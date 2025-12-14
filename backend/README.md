# Sweet Shop Management System - Backend API

A RESTful API backend for the Sweet Shop Management System built with Node.js, Express, and MongoDB.

## 🚀 Features

- **JWT Authentication**: Secure user registration and login
- **Role-Based Access Control**: Admin and User roles
- **Sweet Management**: Full CRUD operations for sweets
- **Inventory Management**: Purchase and restock functionality
- **MongoDB Integration**: Mongoose ODM for database operations
- **Error Handling**: Centralized error handling middleware
- **Input Validation**: Request validation and sanitization

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/sweet-shop
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB:**
   - **Local MongoDB**: Make sure MongoDB is running on your system
   - **MongoDB Atlas**: Update `MONGODB_URI` in `.env` with your Atlas connection string

5. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

   The server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection configuration
├── middleware/
│   ├── authMiddleware.js  # JWT authentication & admin check
│   └── errorMiddleware.js  # Error handling middleware
├── models/
│   ├── User.js            # User model with password hashing
│   └── Sweet.js           # Sweet model
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   └── sweetRoutes.js     # Sweet CRUD & inventory routes
├── server.js              # Main server file
├── package.json           # Dependencies
└── .env                   # Environment variables (create this)
```

## 🔌 API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
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
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### GET /api/auth/me
Get current user (requires authentication).

**Headers:** `Authorization: Bearer <token>`

### Sweets

#### GET /api/sweets
Get all sweets (requires authentication).

**Headers:** `Authorization: Bearer <token>`

#### GET /api/sweets/search
Search sweets by name, category, or price range.

**Query Parameters:**
- `name` (optional): Search by name
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price

**Example:** `/api/sweets/search?name=gulab&category=indian&minPrice=10&maxPrice=100`

#### GET /api/sweets/:id
Get single sweet by ID (requires authentication).

#### POST /api/sweets
Create a new sweet (Admin only).

**Request Body:**
```json
{
  "name": "Gulab Jamun",
  "category": "Indian",
  "price": 50,
  "quantity": 100,
  "description": "Sweet milk dumplings"
}
```

#### PUT /api/sweets/:id
Update a sweet (Admin only).

**Request Body:** Same as POST

#### DELETE /api/sweets/:id
Delete a sweet (Admin only).

### Inventory

#### POST /api/sweets/:id/purchase
Purchase a sweet (decreases quantity).

**Request Body:**
```json
{
  "quantity": 1
}
```

#### POST /api/sweets/:id/restock
Restock a sweet (Admin only, increases quantity).

**Request Body:**
```json
{
  "quantity": 50
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are returned on successful login/registration and expire after 30 days (configurable via `JWT_EXPIRE`).

## 👤 User Roles

- **user**: Default role, can view sweets and make purchases
- **admin**: Can perform CRUD operations and restock inventory

To create an admin user, you can either:
1. Manually update the user in MongoDB: `db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})`
2. Or modify the registration route to allow admin creation (not recommended for production)

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Sweet Schema
```javascript
{
  name: String (required),
  category: String (required),
  price: Number (required, min: 0),
  quantity: Number (required, min: 0),
  description: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Security Features

- Password hashing with bcryptjs (salt rounds: 12)
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- Check `MONGODB_URI` in `.env` file

**JWT Token Errors:**
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration time

**CORS Errors:**
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check CORS configuration in `server.js`

**Port Already in Use:**
- Change `PORT` in `.env` file
- Or stop the process using port 5000

## 📝 Notes

- The backend uses ES6 modules (type: "module" in package.json)
- All routes are prefixed with `/api`
- Error responses follow consistent format: `{ message: "Error message" }`
- Development mode uses nodemon for auto-restart

## 🚦 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 📄 License

This project is part of a MERN stack application for educational purposes.

