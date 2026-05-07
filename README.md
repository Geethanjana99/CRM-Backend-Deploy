# CRM Backend API

A clean architecture Node.js backend for a CRM system with MongoDB, featuring authentication, lead management, notes, and dashboard analytics.

## Project Structure

```
CRM Backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection configuration
│   │   └── constants.js         # Environment constants
│   ├── models/
│   │   ├── User.js              # User schema (authentication)
│   │   ├── Lead.js              # Lead schema
│   │   └── Note.js              # Note schema
│   ├── controllers/
│   │   ├── AuthController.js    # Authentication logic
│   │   ├── LeadController.js    # Lead CRUD operations
│   │   ├── NoteController.js    # Note operations
│   │   └── DashboardController.js # Dashboard statistics
│   ├── services/
│   │   ├── AuthService.js       # Authentication business logic
│   │   ├── LeadService.js       # Lead business logic
│   │   └── NoteService.js       # Note business logic
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── leads.js             # Lead routes
│   │   ├── notes.js             # Note routes
│   │   └── dashboard.js         # Dashboard routes
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Global error handling
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   └── seedData.js          # Initialize test data
│   └── server.js                # Main entry point
├── .env.example                 # Environment variables template
└── package.json                 # Dependencies
```

## Architecture Layers

### 1. **Controller Layer** (HTTP Request Handler)
- Handles incoming HTTP requests
- Validates input parameters
- Calls appropriate services
- Returns HTTP responses

### 2. **Service Layer** (Business Logic)
- Contains all business logic
- Interacts with models
- Handles complex operations
- Returns processed data

### 3. **Model Layer** (Data Schema)
- Defines MongoDB schemas using Mongoose
- Includes validation rules
- Implements custom methods
- Manages indexes

### 4. **Middleware Layer**
- Authentication/Authorization
- Error handling
- Request validation

## Setup Instructions

### 1. Install Dependencies
```bash
cd "CRM Backend"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/crm_db
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user (requires auth)

### Leads
- **POST** `/api/leads` - Create lead (requires auth)
- **GET** `/api/leads` - Get all leads with filtering (requires auth)
- **GET** `/api/leads/:id` - Get lead details (requires auth)
- **PUT** `/api/leads/:id` - Update lead (requires auth)
- **PATCH** `/api/leads/:id/status` - Update lead status (requires auth)
- **DELETE** `/api/leads/:id` - Delete lead (requires auth)

### Notes
- **POST** `/api/leads/:leadId/notes` - Add note to lead (requires auth)
- **GET** `/api/leads/:leadId/notes` - Get lead notes (requires auth)
- **GET** `/api/leads/:leadId/notes/:noteId` - Get specific note (requires auth)
- **PUT** `/api/leads/:leadId/notes/:noteId` - Update note (requires auth)
- **DELETE** `/api/leads/:leadId/notes/:noteId` - Delete note (requires auth)

### Dashboard
- **GET** `/api/dashboard/stats` - Get dashboard statistics (requires auth)

## Test User

Email: `admin@example.com`
Password: `password123`

The test user is automatically created on first run.

## Lead Statuses

- New
- Contacted
- Qualified
- Proposal Sent
- Won
- Lost

## Lead Sources

- Website
- Email
- Phone Call
- Referral
- LinkedIn
- Event
- Other

## Features

✅ JWT-based authentication
✅ Lead management (CRUD operations)
✅ Lead notes system
✅ Advanced filtering (status, source, assigned salesperson)
✅ Full-text search (lead name, company name, email)
✅ Dashboard with analytics
✅ Pagination support
✅ Input validation
✅ Error handling
✅ MongoDB indexing for performance
✅ Clean architecture with separation of concerns

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 404 - Not Found
- 500 - Server Error

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- CORS configuration
- Input validation
- Error message sanitization
- Environment variables for sensitive data

## Next Steps

1. Set up MongoDB Atlas database
2. Configure environment variables
3. Install dependencies
4. Run the development server
5. Test API endpoints using Postman or similar tool
6. Connect React frontend to this API

## Frontend Integration

The frontend should send JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Example:
```javascript
const response = await fetch('http://localhost:5000/api/leads', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```
