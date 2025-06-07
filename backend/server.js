const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const app = express();

// Enhanced CORS configuration for session support
const corsOptions = {
  origin: [
    'https://task-manager-1-s53n.onrender.com', // Your frontend URL
    'http://localhost:5173', // For local development
    /\.onrender\.com$/ // Allow any onrender.com subdomain
  ],
  credentials: true, // This is crucial for sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

// Trust proxy for Render deployment
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Enhanced session configuration
app.use(session({
  store: new pgSession({ 
    pool,
    createTableIfMissing: true,
    tableName: 'session'
  }),
  name: 'taskmanager.sid', // Custom session name
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiration on activity
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Important for cross-origin
    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
  }
}));

// Session debug middleware
app.use((req, res, next) => {
  console.log('Session Debug:', {
    sessionID: req.sessionID,
    session: req.session,
    cookies: req.headers.cookie,
    origin: req.headers.origin
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    session: req.sessionID ? 'Active' : 'None'
  });
});

// Session test endpoint
app.get('/api/session-test', (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    user: req.session?.user || null,
    cookies: req.headers.cookie
  });
});

// Routes
app.use('/api/users', require('./routes/auth'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/tasks', require('./routes/tasks'));

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Trust proxy: ${app.get('trust proxy')}`);
});