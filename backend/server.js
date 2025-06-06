const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // adjust for your frontend
  credentials: true,
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(session({
  store: new pgSession({ pool }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Add this line to use your auth routes
app.use('/api/users', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));