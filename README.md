# User Management System

A full-stack web application for managing user accounts with role-based access control (RBAC), authentication, and user lifecycle management.

## Project Overview

This application provides a comprehensive user management system with the following features:

- **User Authentication**: Secure signup and login with JWT tokens
- **Role-Based Access Control**: Admin and user roles with different permissions
- **User Management**: Admin can view, activate, and deactivate users
- **Profile Management**: Users can view and update their profile information
- **Password Management**: Secure password change functionality
- **Responsive UI**: Modern, mobile-friendly interface

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React.js (with Hooks)
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Styling**: CSS3

### Deployment
- **Backend**: Render
- **Frontend**: Vercel 
- **Database**: MongoDB Atlas

## Project Structure

```
user-management-system/
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/
│   │   └── jwt.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── users.test.js
│   │   └── admin.test.js
│   ├── server.js
│   ├── package.json
│   ├── jest.config.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Modal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:

```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

6. (Optional) Create an admin user for testing:
```bash
npm run seed:admin 

```

This will create an admin user with:
- Email: `admin@example.com`
- Password: `Admin123`
- Role: `admin`

**Note**: Change the password after first login for security.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional for local development) Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```

4. (Optional for local development) Update the `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: The `.env` file is optional for local development. If not provided, the app will default to `http://localhost:5000/api`. However, it's **required for production** when deploying to set the correct backend API URL.

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Running Tests

To run backend tests:
```bash
cd backend
npm test
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS configuration

### Frontend (.env) - Optional for local development
- `VITE_API_URL` - Backend API URL (defaults to `http://localhost:5000/api` if not set)
  
  **Note**: Required only when:
  - Backend is running on a different port
  - Deploying to production (must point to deployed backend URL)

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /api/auth/logout
Logout (client-side token removal).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### User Endpoints

#### GET /api/users/profile
Get user's own profile.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### PUT /api/users/profile
Update user's profile.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "fullName": "Jane Doe"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "newemail@example.com",
      "fullName": "Jane Doe",
      "role": "user",
      "status": "active"
    }
  }
}
```

#### PUT /api/users/change-password
Change user's password.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Admin Endpoints

#### GET /api/admin/users
Get all users with pagination (Admin only).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Users per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "email": "user@example.com",
        "fullName": "John Doe",
        "role": "user",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "usersPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### PUT /api/admin/users/:userId/activate
Activate a user account (Admin only).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "User activated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "active"
    }
  }
}
```

#### PUT /api/admin/users/:userId/deactivate
Deactivate a user account (Admin only).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "status": "inactive"
    }
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Authentication**: Secure token-based authentication
3. **Role-Based Access Control**: Admin and user roles with proper authorization
4. **Input Validation**: Server-side validation on all endpoints
5. **CORS Configuration**: Secure cross-origin resource sharing
6. **Environment Variables**: Sensitive data stored in environment variables
7. **Protected Routes**: Authentication middleware for protected endpoints

## Testing

The backend includes comprehensive unit tests covering:
- User authentication (signup, login)
- User profile management
- Admin functionality
- Error handling

Run tests with:
```bash
cd backend
npm test
```

## Deployment Instructions

### Backend Deployment (Render/Railway)

1. Push your code to GitHub
2. Connect your repository to Render/Railway
3. Set environment variables in the platform:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your frontend URL)
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push your code to GitHub
2. Connect your repository to Vercel/Netlify
3. Set environment variables:
   - `VITE_API_URL` (your backend API URL)
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Deploy

### Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or 0.0.0.0/0 for all)
5. Get your connection string
6. Update `MONGODB_URI` in your backend `.env`

## Features

### User Features
- ✅ Sign up with email, password, and full name
- ✅ Login with email and password
- ✅ View own profile
- ✅ Update profile (name and email)
- ✅ Change password
- ✅ Secure authentication with JWT

### Admin Features
- ✅ View all users with pagination
- ✅ Activate user accounts
- ✅ Deactivate user accounts
- ✅ Role-based access control

### UI/UX Features
- ✅ Responsive design (mobile and desktop)
- ✅ Loading states
- ✅ Error handling and display
- ✅ Success notifications
- ✅ Form validation
- ✅ Confirmation modals
- ✅ Clean, modern interface 



  ## DEPLOYMENT : (FRONTEND + BACKEND): 
   **BACKEND** :  RENDER : https://user-management-system-rbac-model-1.onrender.com/ 
   **FRONTEND**:  VERCEL : https://user-management-system-rbac-model.vercel.app/login
## POSTMAN API TESTING REQUEST(PUBLIC): https://elements.getpostman.com/redirect?entityId=32999119-0a6710d0-a08f-4b9d-95c3-156211a22740&entityType=collection
