const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('is_admin').optional().isBoolean().withMessage('is_admin must be a boolean')
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').exists().withMessage('Password required')
  ],
  authController.login
);

module.exports = router;