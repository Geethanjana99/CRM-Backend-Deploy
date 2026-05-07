# Clean Architecture Design

## Overview

This CRM backend follows the **Clean Architecture** pattern, which promotes:
- **Separation of Concerns**: Each layer has a specific responsibility
- **Testability**: Services can be easily unit tested
- **Maintainability**: Code is organized logically
- **Scalability**: Easy to add new features

---

## Architecture Layers

### 1. **Route Layer** (HTTP Entry Point)
```
File: src/routes/*.js

Responsibility:
- Define HTTP endpoints
- Map requests to controllers
- Define middleware (auth, validation)

Example:
POST /api/leads → LeadController.createLead()
GET  /api/leads → LeadController.getAllLeads()
```

### 2. **Controller Layer** (HTTP Request Handler)
```
File: src/controllers/*.js

Responsibility:
- Receive HTTP requests
- Extract and validate input
- Call appropriate service
- Return HTTP responses
- Handle HTTP-specific errors

Flow:
Request → Validate Input → Call Service → Format Response
```

**Example Flow:**
```javascript
async createLead(req, res, next) {
  // 1. Validate input
  if (!name || !email) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  
  // 2. Call service
  const lead = await LeadService.createLead(data);
  
  // 3. Return response
  res.status(201).json({ success: true, data: lead });
}
```

### 3. **Service Layer** (Business Logic)
```
File: src/services/*.js

Responsibility:
- Implement business logic
- Handle data transformations
- Perform complex operations
- Interact with models
- Return formatted data

Key Point: NO HTTP knowledge here
- No req/res
- No status codes
- Pure business logic
```

**Example Flow:**
```javascript
async createLead(leadData, userId) {
  // 1. Create document
  const lead = new Lead({ ...leadData, createdBy: userId });
  
  // 2. Save to DB
  await lead.save();
  
  // 3. Populate relationships
  await lead.populate('assignedSalesperson');
  
  // 4. Return formatted data
  return lead;
}
```

### 4. **Model Layer** (Data Schema)
```
File: src/models/*.js

Responsibility:
- Define MongoDB schemas
- Add validators
- Define indexes
- Create helper methods
- Ensure data integrity

Key Features:
- Schema definition
- Field validation
- Custom methods (matchPassword, etc.)
- Database indexes for performance
```

**Example Model:**
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Method available on user instances
userSchema.methods.matchPassword = async function(pwd) {
  return await bcrypt.compare(pwd, this.password);
};
```

### 5. **Middleware Layer** (Cross-Cutting Concerns)
```
File: src/middleware/*.js

Responsibility:
- Authentication (auth.js)
- Error handling (errorHandler.js)
- Request validation
- Logging
- CORS handling
```

### 6. **Config Layer** (Configuration)
```
File: src/config/*.js

Responsibility:
- Environment configuration
- Database connection
- Constants
- External API setup
```

### 7. **Utils Layer** (Helpers)
```
File: src/utils/*.js

Responsibility:
- Helper functions
- Validators
- Formatters
- Seed data
```

---

## Data Flow Diagram

### Creating a Lead (POST /api/leads)

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Request                           │
│         POST /api/leads with lead data                       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Route Layer                                  │
│  leads.js: router.post('/', LeadController.createLead)       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               Middleware Layer                                │
│  - authMiddleware: Verify JWT token                          │
│  - Attach user to req.user                                   │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│             Controller Layer                                  │
│  LeadController.createLead(req, res, next)                   │
│  - Extract lead data from req.body                           │
│  - Validate required fields                                  │
│  - Call LeadService.createLead()                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Service Layer                                    │
│  LeadService.createLead(leadData, userId)                    │
│  - Create new Lead instance                                  │
│  - Set timestamps and creator                                │
│  - Save to database                                          │
│  - Populate relationships (salesperson, creator)             │
│  - Return lead object                                        │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Model Layer                                      │
│  Lead.js (Mongoose Schema)                                   │
│  - Validate all fields                                       │
│  - Check uniqueness constraints                              │
│  - Save to MongoDB                                           │
│  - Return saved document                                     │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Database Layer                                   │
│  MongoDB Atlas                                               │
│  - Store lead document                                       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
        (Response flows back through layers)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│             Controller Formats Response                       │
│  res.status(201).json({                                      │
│    success: true,                                            │
│    message: 'Lead created successfully',                     │
│    data: lead                                                │
│  })                                                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Client Response                              │
│         201 Created with lead data                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Request-Response Flow (Example)

### User Login Flow

```javascript
// 1. CLIENT sends request
POST http://localhost:5000/api/auth/login
{
  email: "admin@example.com",
  password: "password123"
}

// 2. ROUTE receives request
router.post('/login', AuthController.login)

// 3. CONTROLLER handles HTTP
async login(req, res, next) {
  const { email, password } = req.body;
  
  // Call service with data only
  const result = await AuthService.loginUser(email, password);
  
  // Format HTTP response
  res.status(200).json({
    success: true,
    data: result
  });
}

// 4. SERVICE executes business logic
async loginUser(email, password) {
  // Find user
  const user = await User.findOne({ email }).select('+password');
  
  // Compare password
  const isMatch = await user.matchPassword(password);
  
  // Generate token
  const token = this.generateToken(user._id);
  
  // Return data (no HTTP)
  return { user, token };
}

// 5. MODEL handles database
User.findOne({ email })
  → Query MongoDB
  → Return user document

// 6. CONTROLLER sends HTTP response
{
  success: true,
  data: {
    user: { id, name, email, role },
    token: "eyJ..."
  }
}
```

---

## Separation of Concerns

### Controller SHOULD NOT:
- ❌ Know about MongoDB
- ❌ Execute business logic
- ❌ Validate complex rules
- ❌ Know about passwords hashing

### Service SHOULD NOT:
- ❌ Know about HTTP (req, res)
- ❌ Know about status codes
- ❌ Return HTTP responses
- ❌ Validate HTTP headers

### Model SHOULD NOT:
- ❌ Know about business logic
- ❌ Know about HTTP
- ❌ Know about services

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Exception Occurs                             │
│  throw new Error('User already exists')                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               Error Handling Options                          │
│                                                              │
│  Option 1: Catch in Controller                              │
│  } catch (error) {                                           │
│    res.status(400).json({ message: error.message });         │
│  }                                                           │
│                                                              │
│  Option 2: Pass to next() - Global Handler                  │
│  } catch (error) {                                           │
│    next(error);  // Goes to errorHandler middleware         │
│  }                                                           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│           Global Error Handler Middleware                    │
│                                                              │
│  errorHandler(err, req, res, next) {                        │
│    - Log error                                              │
│    - Determine HTTP status                                  │
│    - Format response                                        │
│    - Send to client                                         │
│  }                                                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Error Response to Client                     │
│  {                                                           │
│    success: false,                                           │
│    message: "Validation Error"                              │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Benefits of This Architecture

### 1. **Testability**
```javascript
// Easy to test service in isolation
describe('LeadService', () => {
  it('should create a lead', async () => {
    const lead = await LeadService.createLead(mockData, mockUserId);
    expect(lead).toBeDefined();
  });
});
```

### 2. **Reusability**
```javascript
// Same service can be used by different controllers or future APIs
LeadService.createLead()  // Used by Controller
LeadService.createLead()  // Could be used by GraphQL resolver
LeadService.createLead()  // Could be used by WebSocket handler
```

### 3. **Maintainability**
- Find all lead-related code in LeadService
- Update business logic without touching controllers
- Change HTTP handling without changing logic

### 4. **Scalability**
```
New Feature? 
  1. Add Model (if needed)
  2. Add Service Logic
  3. Add Controller & Route
  4. Done!
```

### 5. **Clear Responsibilities**
```
Route   → "Where should this request go?"
Control → "How do I handle this HTTP request?"
Service → "What should I do with this data?"
Model   → "How is this data stored?"
```

---

## Common Patterns

### Pattern 1: CRUD Operations
```javascript
// Service
createLead(data) { }
getLeadById(id) { }
getAllLeads(filters) { }
updateLead(id, data) { }
deleteLead(id) { }

// Controller wraps each with HTTP
POST   /leads         → createLead()
GET    /leads/:id     → getLeadById()
GET    /leads         → getAllLeads()
PUT    /leads/:id     → updateLead()
DELETE /leads/:id     → deleteLead()
```

### Pattern 2: Validation
```javascript
// Controller validates HTTP
const { email } = req.body;
if (!email) {
  return res.status(400).json({ message: 'Email required' });
}

// Model validates data
email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true
}
```

### Pattern 3: Population/Relationships
```javascript
// Service handles joins
const lead = await Lead.findById(id)
  .populate('assignedSalesperson', 'name email')
  .populate('createdBy', 'name email');

return lead;  // Returns populated object
```

---

## Summary

This architecture ensures:
- ✅ **Clean Code**: Each file has one responsibility
- ✅ **Easy Testing**: Services are testable
- ✅ **Easy Maintenance**: Changes are localized
- ✅ **Scalability**: Easy to add features
- ✅ **Professional**: Industry best practices
- ✅ **Flexible**: Easy to change components

The key principle: **Each layer should only know about the layer below it.**
