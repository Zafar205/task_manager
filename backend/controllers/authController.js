const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { createUser, findUserByEmail } = require('../models/user');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  console.log('Register request received:', req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, is_admin } = req.body;
  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [user] = await createUser(email, password_hash, is_admin || false);
    
    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      is_admin: user.is_admin
    });
    
    console.log('User registered successfully:', user.email);
    
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id, 
        email: user.email, 
        is_admin: user.is_admin 
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      is_admin: user.is_admin
    });
    
    console.log('User logged in successfully:', user.email);
    
    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id, 
        email: user.email, 
        is_admin: user.is_admin 
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.logout = async (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({ 
    success: true,
    message: 'Logout successful' 
  });
};

exports.me = async (req, res) => {
  // This endpoint returns current user info (requires authentication)
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        is_admin: req.user.is_admin
      }
    });
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};