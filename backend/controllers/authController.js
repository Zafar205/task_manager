const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { createUser, findUserByEmail } = require('../models/user');

exports.register = async (req, res) => {
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
    
    req.session.userId = user.id;
    res.status(201).json({ id: user.id, email: user.email, is_admin: user.is_admin });
  } catch (err) {
    console.error(err);
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

    req.session.userId = user.id;
    res.json({ id: user.id, email: user.email, is_admin: user.is_admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};