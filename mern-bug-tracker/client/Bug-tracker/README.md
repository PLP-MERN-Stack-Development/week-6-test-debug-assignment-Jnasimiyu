# MERN Bug Tracker

A comprehensive bug tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring extensive testing, debugging capabilities, and robust error handling.

## Features

### Core Functionality
- **Bug Management**: Create, read, update, and delete bug reports
- **Status Tracking**: Track bugs through their lifecycle (open, in-progress, resolved, closed)
- **Severity Levels**: Categorize bugs by severity (low, medium, high, critical)
- **Filtering & Sorting**: Filter bugs by status and sort by various criteria
- **Tagging System**: Add tags to bugs for better organization
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **Comprehensive Testing**: Unit and integration tests for both frontend and backend
- **Error Handling**: Robust error handling with user-friendly error messages
- **Error Boundaries**: React error boundaries to gracefully handle UI crashes
- **Input Validation**: Client-side and server-side validation
- **Security**: Rate limiting, CORS, and data sanitization
- **Debugging Tools**: Console logging and Chrome DevTools integration

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework with middleware for security and error handling
- **MongoDB**: NoSQL database with Mongoose ODM
- **Jest**: Testing framework for unit and integration tests
- **Supertest**: HTTP testing library

### Frontend
- **React**: UI library with hooks and context
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Vitest**: Testing framework
- **React Testing Library**: Testing utilities for React components

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- MongoDB (v6 or higher)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mern-bug-tracker.git
cd mern-bug-tracker
```

### 2. Install Dependencies
```bash
# Install root dependencies
pnpm install

# Install all dependencies (backend and frontend)
pnpm run install:all
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bug-tracker
JWT_SECRET=your-secret-key-here
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the Application
```bash
# Development mode (runs both backend and frontend)
pnpm run dev

# Or run separately
pnpm run server  # Backend only
pnpm run client  # Frontend only
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/bugs

## Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run backend tests only
pnpm run test:backend

# Run frontend tests only
pnpm run test:frontend

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
cd backend && pnpm run test:coverage
cd frontend && pnpm run test:coverage
```

### Test Coverage
Our comprehensive test suite includes:

#### Backend Tests
- **Unit Tests**: Validation utilities and helper functions
- **Integration Tests**: API endpoints with database operations
- **Model Tests**: Database schema validation
- **Middleware Tests**: Error handling and validation

#### Frontend Tests
- **Component Tests**: Individual React components
- **Integration Tests**: Component interactions and API calls
- **Error Boundary Tests**: Error handling and recovery
- **Form Validation Tests**: Input validation and user interactions

### Testing Approach
1. **Test-Driven Development**: Write tests before implementing features
2. **Mocking**: Mock external dependencies and API calls
3. **Edge Cases**: Test error conditions and boundary values
4. **User Experience**: Test user workflows and interactions
5. **Accessibility**: Ensure components are accessible

## Debugging Techniques

### Chrome DevTools
The application includes extensive debugging support:

1. **Network Tab**: Monitor API requests and responses
2. **Console Logging**: Detailed logging throughout the application
3. **React Developer Tools**: Inspect component state and props
4. **Redux DevTools**: Track state changes (if using Redux)

### Node.js Inspector
For backend debugging:
```bash
# Start server with debugger
pnpm run dev

# Open Chrome and navigate to:
chrome://inspect

# Click "Open dedicated DevTools for Node"
```

### Debugging Features
- **Console Logging**: Strategic console.log statements throughout the codebase
- **Error Tracking**: Comprehensive error logging with timestamps
- **API Debugging**: Request/response logging in development
- **State Debugging**: React context and state change logging

## Error Handling

### Backend Error Handling
- **Global Error Middleware**: Centralized error handling
- **Validation Errors**: Detailed validation error messages
- **Database Errors**: MongoDB error handling and user-friendly messages
- **HTTP Status Codes**: Appropriate status codes for different error types

### Frontend Error Handling
- **Error Boundaries**: Catch and handle React component errors
- **API Error Handling**: User-friendly error messages for failed requests
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Proper loading and error states for better UX

## API Documentation

### Endpoints

#### GET /api/bugs
Get all bugs with optional filtering
- Query parameters: `status`, `severity`, `sort`
- Response: Array of bug objects

#### POST /api/bugs
Create a new bug report
- Body: Bug object with title, description, etc.
- Response: Created bug object

#### GET /api/bugs/:id
Get a specific bug by ID
- Parameters: Bug ID
- Response: Bug object

#### PUT /api/bugs/:id
Update an existing bug
- Parameters: Bug ID
- Body: Updated bug data
- Response: Updated bug object

#### DELETE /api/bugs/:id
Delete a bug
- Parameters: Bug ID
- Response: Success message

### Error Responses
All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Project Structure

```
mern-bug-tracker/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── bugController.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── models/
│   │   └── Bug.js
│   ├── routes/
│   │   └── bugRoutes.js
│   ├── tests/
│   │   ├── bug.test.js
│   │   └── validation.test.js
│   ├── utils/
│   │   └── validation.js
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BugList.jsx
│   │   │   ├── BugForm.jsx
│   │   │   ├── BugDetails.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── Header.jsx
│   │   ├── context/
│   │   │   └── BugContext.jsx
│   │   ├── services/
│   │   │   └── bugService.js
│   │   ├── tests/
│   │   │   ├── BugForm.test.jsx
│   │   │   ├── BugList.test.jsx
│   │   │   └── ErrorBoundary.test.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── package.json
└── README.md
```

## Development Guidelines

### Code Style
- **ESLint**: Linting for code quality and consistency
- **Prettier**: Code formatting
- **JSDoc**: Documentation for functions and classes
- **Semantic Commits**: Clear commit messages

### Best Practices
1. **Single Responsibility**: Each component/function has one purpose
2. **Error Handling**: Always handle errors gracefully
3. **Testing**: Write tests for all new features
4. **Documentation**: Keep README and code comments updated
5. **Security**: Follow security best practices

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the GitHub repository or contact the development team.

---

**Happy Bug Tracking!** 🐛✨