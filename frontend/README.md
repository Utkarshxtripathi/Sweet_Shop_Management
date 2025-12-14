# Sweet Shop Management System - Complete MERN Stack

A full-stack web application for managing a sweet shop inventory system. Built with MongoDB, Express, React, and Node.js.

## 🏗️ Project Structure

```
Sweet Shop/
├── backend/          # Node.js + Express + MongoDB API
│   ├── config/       # Database configuration
│   ├── middleware/   # Auth & error handling
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── server.js     # Main server file
│
└── src/              # React frontend
    ├── components/   # Reusable UI components
    ├── context/      # React Context (Auth)
    ├── pages/        # Page components
    ├── routes/       # Protected routes
    ├── services/     # API service layer
    └── utils/        # Utility functions
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/sweet-shop
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if using local):
   - Make sure MongoDB is running on your system

5. **Start backend server:**
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to root directory** (if in backend folder):
   ```bash
   cd ..
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Create `.env` file** (if not exists):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start frontend:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 📋 Features

### Frontend
- ✅ User authentication (Login/Register)
- ✅ JWT token management
- ✅ Dashboard with sweets listing
- ✅ Search functionality (name, category, price range)
- ✅ Purchase system
- ✅ Admin panel (CRUD operations)
- ✅ Restock functionality
- ✅ Responsive UI with Tailwind CSS
- ✅ Protected routes
- ✅ Role-based access control

### Backend
- ✅ RESTful API with Express
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ User roles (user/admin)
- ✅ Sweet CRUD operations
- ✅ Inventory management
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Input validation

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Sweets
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets
- `GET /api/sweets/:id` - Get single sweet
- `POST /api/sweets` - Create sweet (Admin)
- `PUT /api/sweets/:id` - Update sweet (Admin)
- `DELETE /api/sweets/:id` - Delete sweet (Admin)

### Inventory
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin)

## 🔐 Authentication

JWT tokens are automatically attached to all API requests from the frontend. Tokens expire after 30 days (configurable).

## 👤 User Roles

- **User**: Can view sweets, search, and purchase
- **Admin**: Full access including CRUD operations and restocking

## 📚 Documentation

- **Frontend**: See `README.md` in root (frontend documentation)
- **Backend**: See `backend/README.md` (backend API documentation)
- **Integration**: See `INTEGRATION_GUIDE.md` (API contract details)
- **Structure**: See `PROJECT_STRUCTURE.md` (architecture overview)

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS configuration in backend

**Database connection issues:**
- For local MongoDB: Ensure service is running
- For MongoDB Atlas: Verify connection string and network access

## 📝 Development Notes

- Backend uses ES6 modules
- Frontend uses Vite for fast development
- Both projects have separate `package.json` files
- Environment variables are required for both

## 🚦 Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## 📄 License

This project is for educational purposes.
