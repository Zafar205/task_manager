const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', taskController.getTasks);

router.post(
  '/',
  requireAdmin,
  [
    body('title').notEmpty().withMessage('Task title is required'),
    body('team_id').isNumeric().withMessage('Valid team ID is required'),
    body('due_date').optional().isISO8601().withMessage('Valid due date required'),
    body('assigned_to').optional().isNumeric().withMessage('Valid user ID required'),
  ],
  taskController.createTask
);

router.put(
  '/:id',
  requireAdmin,
  [
    body('title').optional().notEmpty().withMessage('Task title cannot be empty'),
    body('team_id').optional().isNumeric().withMessage('Valid team ID is required'),
    body('due_date').optional().isISO8601().withMessage('Valid due date required'),
    body('assigned_to').optional().isNumeric().withMessage('Valid user ID required'),
  ],
  taskController.updateTask
);

router.delete('/:id', requireAdmin, taskController.deleteTask);

module.exports = router;