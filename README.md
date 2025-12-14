# Sweet Shop Management System

A full-stack web application that enables users to browse, search, and purchase sweets, while providing administrators with comprehensive inventory management capabilities. This project demonstrates modern web development practices, including RESTful API design, JWT-based authentication, role-based access control, and seamless frontend-backend integration.

## Live Deployment

The application is fully deployed and accessible online:

- **Frontend (Netlify)**: [https://sweetshopmanagement16.netlify.app/](https://sweetshopmanagement16.netlify.app/)
- **Backend API (Render)**: [https://sweet-shop-management-backend-ynwu.onrender.com](https://sweet-shop-management-backend-ynwu.onrender.com)

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Configuration](#api-configuration)
- [Admin Demo Credentials](#admin-demo-credentials)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)
- [License](#license)

## Project Overview

The Sweet Shop Management System is a comprehensive e-commerce solution designed for managing a sweet shop's inventory and sales operations. The application provides distinct experiences for regular users and administrators, with role-based access control ensuring secure and appropriate functionality for each user type.

Key aspects of the project include:

- Clean separation between frontend and backend architectures
- RESTful API design following industry best practices
- Secure authentication and authorization mechanisms
- Real-time inventory updates during purchases
- Advanced search and filtering capabilities
- Responsive user interface with modern design principles

## Tech Stack

### Frontend

- **React 18**: Modern UI library for building interactive user interfaces
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Context API**: State management for authentication and user data

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for building REST APIs
- **MongoDB Atlas**: Cloud-hosted NoSQL database
- **Mongoose**: MongoDB object modeling library
- **JWT (JSON Web Tokens)**: Token-based authentication
- **bcrypt**: Password hashing library for secure credential storage

## Features

### User Features

- **User Registration and Login**: Secure account creation and authentication
- **JWT-Based Authentication**: Token-based session management with automatic token refresh handling
- **Browse Sweets**: View all available sweets with detailed information
- **Advanced Search**: Search sweets by name, category, and price range
- **Purchase Functionality**: Purchase sweets with automatic inventory updates
- **Stock Availability**: Real-time stock checking with disabled purchase options when items are out of stock
- **Responsive Dashboard**: User-friendly interface optimized for various screen sizes

### Admin Features

- **Admin Authentication**: Secure admin login with role-based access
- **Role-Based Authorization**: Protected routes and API endpoints restricted to admin users
- **Sweet Management**: Complete CRUD operations for managing sweet inventory
  - Add new sweets with full product details
  - Update existing sweet information
  - Delete sweets from inventory
- **Inventory Restocking**: Add stock quantities to existing products
- **Admin-Only UI**: Dedicated admin panel with full management capabilities
- **Protected APIs**: Backend endpoints secured with admin role verification

## Architecture

The application follows a clean, modular architecture with clear separation of concerns:

### Frontend Architecture

- **Component-Based Design**: Reusable UI components for maintainability
- **Context API**: Centralized authentication state management
- **Service Layer**: Abstracted API communication layer
- **Protected Routes**: Route guards for authentication and authorization
- **Error Handling**: Comprehensive error handling and user feedback

### Backend Architecture

- **RESTful API Design**: Standard HTTP methods and status codes
- **Middleware Pattern**: Authentication, error handling, and request processing
- **Model-View-Controller**: Clear separation between data models, routes, and business logic
- **Database Abstraction**: Mongoose ODM for database operations
- **Security Layers**: Password hashing, JWT validation, and role-based access control

### Key Architectural Highlights

- Clean separation of frontend and backend codebases
- RESTful API design following industry standards
- Role-based access control (Admin/User) at both API and UI levels
- Secure authentication using JWT tokens with expiration handling
- MongoDB persistence with Mongoose schema validation
- Deployed frontend and backend on separate platforms
- Scalable and modular code structure for future enhancements

## Getting Started

### Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (version 16 or higher)
- npm or yarn package manager
- MongoDB Atlas account (for cloud database) or local MongoDB installation
- Git (for cloning the repository)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Sweet Shop"
```

#### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

#### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will run on `http://localhost:5173` (or the next available port)

#### 4. Running Both Servers

You will need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/sweet-shop` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-key` |
| `JWT_EXPIRE` | JWT token expiration time | `30d` |
| `FRONTEND_URL` | Frontend URL for CORS configuration | `http://localhost:5173` |

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

**Note**: For production builds, update the API base URL in `frontend/src/services/api.js` or use environment variables with Vite's import.meta.env.

## API Configuration

The frontend API service is configured in `frontend/src/services/api.js`. By default, it points to the deployed backend URL. For local development:

1. Update the `baseURL` in `frontend/src/services/api.js` to `http://localhost:5000`
2. Or use the `VITE_API_URL` environment variable and update the code to use `import.meta.env.VITE_API_URL`

The API automatically includes JWT tokens in the Authorization header for authenticated requests and handles token expiration and refresh.

## Admin Demo Credentials

For evaluation and testing purposes, the following demo credentials are available:

**Admin Account:**
- Email: `admin@demo.com`
- Password: `admin123`

**Note**: These credentials are provided for demonstration purposes only. In a production environment, admin accounts should be created securely and credentials should never be shared publicly.

To create additional admin users, you can:
1. Register a new user through the registration endpoint
2. Manually update the user role in MongoDB to "admin"
3. Use the admin creation script if available in the backend

## Project Structure

```
Sweet Shop/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication & admin verification
│   │   └── errorMiddleware.js    # Centralized error handling
│   ├── models/
│   │   ├── User.js               # User model with password hashing
│   │   └── Sweet.js              # Sweet product model
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   └── sweetRoutes.js       # Sweet CRUD & inventory endpoints
│   ├── scripts/
│   │   └── createAdmin.js        # Admin user creation utility
│   ├── server.js                 # Main Express server file
│   ├── package.json              # Backend dependencies
│   └── .env                      # Backend environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Alert.jsx         # Alert notification component
    │   │   ├── Button.jsx        # Reusable button component
    │   │   ├── Input.jsx         # Form input component
    │   │   └── Loading.jsx       # Loading spinner component
    │   ├── context/
    │   │   └── AuthContext.jsx   # Authentication context provider
    │   ├── pages/
    │   │   ├── Admin.jsx         # Admin dashboard page
    │   │   ├── Dashboard.jsx     # User dashboard page
    │   │   ├── Login.jsx         # Login page
    │   │   └── Register.jsx      # Registration page
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx # Route protection component
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── utils/
    │   │   └── token.js          # JWT token utilities
    │   ├── App.jsx               # Main application component
    │   ├── main.jsx              # Application entry point
    │   └── index.css             # Global styles
    ├── package.json              # Frontend dependencies
    ├── vite.config.js            # Vite configuration
    ├── tailwind.config.js        # Tailwind CSS configuration
    └── .env                      # Frontend environment variables
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

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
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register endpoint

#### GET /api/auth/me
Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

### Sweet Endpoints

#### GET /api/sweets
Retrieve all available sweets (requires authentication).

**Headers:** `Authorization: Bearer <token>`

#### GET /api/sweets/search
Search and filter sweets by various criteria.

**Query Parameters:**
- `name` (optional): Search by sweet name
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Example:** `/api/sweets/search?name=gulab&category=indian&minPrice=10&maxPrice=100`

#### GET /api/sweets/:id
Get detailed information about a specific sweet (requires authentication).

#### POST /api/sweets
Create a new sweet product (Admin only).

**Request Body:**
```json
{
  "name": "Gulab Jamun",
  "category": "Indian",
  "price": 50,
  "quantity": 100,
  "description": "Sweet milk dumplings in sugar syrup"
}
```

#### PUT /api/sweets/:id
Update an existing sweet product (Admin only).

**Request Body:** Same structure as POST endpoint

#### DELETE /api/sweets/:id
Delete a sweet product from inventory (Admin only).

### Inventory Endpoints

#### POST /api/sweets/:id/purchase
Purchase a sweet and decrease inventory quantity.

**Request Body:**
```json
{
  "quantity": 1
}
```

**Response:** Updated sweet object with new quantity

#### POST /api/sweets/:id/restock
Restock a sweet and increase inventory quantity (Admin only).

**Request Body:**
```json
{
  "quantity": 50
}
```

**Response:** Updated sweet object with new quantity

## Screenshots

Screenshots of the application will be added here to showcase the user interface and functionality.

### User Dashboard
![User Dashboard](screenshots/user-dashboard.png)

### Admin Panel
![Admin Panel](screenshots/admin-panel.png)

### Search Functionality
![Search Results](screenshots/search-results.png)

### Purchase Flow
![Purchase Process](screenshots/purchase-flow.png)

## My AI Usage

This project utilized AI tools as a development assistant to enhance productivity and learning. The following describes how AI was integrated into the development process:

**AI-Assisted Development:**
- AI tools were used for guidance on best practices, architectural patterns, and clarification of technical concepts
- Boilerplate code generation was assisted by AI to accelerate initial setup
- Code review and suggestions were obtained for improving code quality and following industry standards

**Developer Responsibility:**
- All core logic, business requirements, and architectural decisions were designed and implemented by the developer
- Code was thoroughly reviewed, tested, and modified by the developer to ensure correctness and alignment with project requirements
- The final implementation reflects the developer's understanding and application of the concepts

**Ethical Usage:**
- AI was used responsibly as a productivity tool to enhance learning and development efficiency
- All code was written, reviewed, and understood by the developer
- The project represents original work with AI assistance, not code plagiarism or unauthorized copying

This approach demonstrates the effective and ethical use of AI tools in software development, where AI serves as a learning and productivity enhancement tool rather than a replacement for developer understanding and creativity.

## License

This project is developed for educational and portfolio purposes. All code is available for review and learning.

---

**Developed with modern web technologies and best practices in full-stack development.**

