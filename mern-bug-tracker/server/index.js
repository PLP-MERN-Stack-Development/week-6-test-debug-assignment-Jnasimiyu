/**
 * Main server file for Bug Tracker API
 * Sets up Express server with middleware, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const bugRoutes = require('./routes/bugRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// ✅ Connect to DB unless in test mode
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// ✅ Security middleware
app.use(helmet());

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', limiter);

// ✅ CORS setup
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  })
);

// ✅ Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Logging only in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Main bug routes
app.use('/api/bugs', bugRoutes);

// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);

// ✅ Start server unless in test mode
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Debugger: chrome://inspect`);
    }
  });
}

// ✅ Export app for Supertest
module.exports = app;
