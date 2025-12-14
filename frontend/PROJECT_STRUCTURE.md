# Project Structure

## Frontend Folder Structure

```
sweet-shop-frontend/
├── public/                 # Static assets (if any)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Alert.jsx      # Alert/notification component
│   │   ├── Button.jsx     # Reusable button with variants
│   │   ├── Input.jsx      # Form input component
│   │   └── Loading.jsx    # Loading spinner component
│   │
│   ├── context/           # React Context providers
│   │   └── AuthContext.jsx # Global auth state management
│   │
│   ├── pages/             # Page-level components
│   │   ├── Login.jsx      # Login page
│   │   ├── Register.jsx   # Registration page
│   │   ├── Dashboard.jsx  # Main dashboard (all users)
│   │   └── Admin.jsx      # Admin panel (admin only)
│   │
│   ├── routes/            # Route protection
│   │   └── ProtectedRoute.jsx # HOC for protected routes
│   │
│   ├── services/          # API service layer
│   │   └── api.js         # Axios config + all API calls
│   │
│   ├── utils/             # Utility functions
│   │   └── token.js       # JWT token helpers
│   │
│   ├── App.jsx            # Main app (routing setup)
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles (Tailwind)
│
├── index.html             # HTML template
├── package.json           # Dependencies & scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── .gitignore            # Git ignore rules
└── README.md             # Documentation
```

## Architecture Overview

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Login (Public)
│       ├── Register (Public)
│       ├── Dashboard (Protected)
│       └── Admin (Protected + Admin Only)
```

### Data Flow

1. **Authentication Flow:**
   - User submits login/register form
   - API service calls backend
   - AuthContext receives token
   - Token stored in localStorage
   - User state updated globally

2. **API Request Flow:**
   - Component calls service function
   - Axios interceptor adds JWT token
   - Request sent to backend
   - Response handled with error/success states

3. **Protected Route Flow:**
   - Route wrapped in ProtectedRoute
   - Checks authentication status
   - Checks admin role (if required)
   - Renders component or redirects

## Key Design Decisions

1. **Service Layer Pattern**: All API calls centralized in `services/api.js`
2. **Context API**: Global auth state instead of prop drilling
3. **Protected Routes**: Route-level access control
4. **Component Separation**: UI components separate from business logic
5. **Utility Functions**: Token management isolated in utils

## File Responsibilities

- **components/**: Pure UI components, no business logic
- **pages/**: Page components with form handling and API calls
- **services/**: All HTTP communication with backend
- **context/**: Global state management
- **utils/**: Helper functions (token decoding, validation)
- **routes/**: Route protection logic

