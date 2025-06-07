const express = require('express');
const { body } = require('express-validator');
const teamController = require('../controllers/teamController');

const router = express.Router();

// Debug route
router.get('/debug-session', (req, res) => {
  res.json({
    session: req.session,
    sessionID: req.sessionID,
    userId: req.session.userId,
    cookies: req.headers.cookie
  });
});

router.get('/', teamController.getTeams);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Team name is required'),
  ],
  teamController.createTeam
);

router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Team name is required'),
  ],
  teamController.updateTeam
);

router.delete('/:id', teamController.deleteTeam);

// Team members routes
router.get('/:id/members', teamController.getTeamMembers);
router.post(
  '/:id/members',
  [
    body('userIds').isArray({ min: 1 }).withMessage('userIds must be a non-empty array'),
    body('userIds.*').isNumeric().withMessage('Each user ID must be a number'),
  ],
  teamController.addTeamMembers
);
router.delete('/:id/members/:userId', teamController.removeTeamMember);

module.exports = router;