const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { createUser, findUserByEmail } = require('../models/user');

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
    
    // Store user info in session and force save
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.isAdmin = user.is_admin;
    
    console.log('Session after register:', req.session);
    
    // Force session save
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Session error' });
      }
      console.log('Session saved successfully');
      res.status(201).json({ id: user.id, email: user.email, is_admin: user.is_admin });
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
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
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Store user info in session and force save
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.isAdmin = user.is_admin;
    
    console.log('Session after login:', req.session);
    
    // Force session save
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Session error' });
      }
      console.log('Session saved successfully');
      res.json({ id: user.id, email: user.email, is_admin: user.is_admin });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};