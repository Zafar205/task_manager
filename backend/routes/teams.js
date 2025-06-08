const express = require('express');
const { body } = require('express-validator');
const teamController = require('../controllers/teamController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', teamController.getTeams);

router.post(
  '/',
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Team name is required'),
  ],
  teamController.createTeam
);

router.put(
  '/:id',
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Team name is required'),
  ],
  teamController.updateTeam
);

router.delete('/:id', requireAdmin, teamController.deleteTeam);

// Team members routes
router.get('/:id/members', teamController.getTeamMembers);
router.post(
  '/:id/members',
  requireAdmin,
  [
    body('userIds').isArray({ min: 1 }).withMessage('userIds must be a non-empty array'),
    body('userIds.*').isNumeric().withMessage('Each user ID must be a number'),
  ],
  teamController.addTeamMembers
);
router.delete('/:id/members/:userId', requireAdmin, teamController.removeTeamMember);

module.exports = router;