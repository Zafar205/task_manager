const { validationResult } = require('express-validator');
const { 
  createTeam, 
  getAllTeams, 
  getTeamById, 
  updateTeam, 
  deleteTeam, 
  getUserTeams,
  getTeamMembers,
  addTeamMembers,
  removeTeamMember
} = require('../models/teams');

exports.getTeams = async (req, res) => {
  try {
    console.log('Get teams - Session:', req.session);
    console.log('Get teams - Session ID:', req.sessionID);
    
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized - No session found' });
    }

    const teams = await getAllTeams();
    res.json(teams);
  } catch (err) {
    console.error('Get teams error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTeam = async (req, res) => {
  console.log('Create team - Session:', req.session);
  console.log('Create team - Session ID:', req.sessionID);
  console.log('Create team - Body:', req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized - No session found' });
    }

    const [team] = await createTeam(name, req.session.userId);
    console.log('Team created:', team);
    res.status(201).json(team);
  } catch (err) {
    console.error('Create team error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTeam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name } = req.body;
  
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [team] = await updateTeam(id, name);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (err) {
    console.error('Update team error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTeam = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const deleted = await deleteTeam(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error('Delete team error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// New member management functions
exports.getTeamMembers = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const members = await getTeamMembers(id);
    res.json(members);
  } catch (err) {
    console.error('Get team members error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTeamMembers = async (req, res) => {
  const { id } = req.params;
  const { userIds } = req.body;
  
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'userIds array is required' });
    }

    await addTeamMembers(id, userIds);
    res.json({ message: 'Members added successfully' });
  } catch (err) {
    console.error('Add team members error:', err);
    if (err.code === '23505') { // Duplicate key error
      res.status(400).json({ message: 'One or more users are already members of this team' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

exports.removeTeamMember = async (req, res) => {
  const { id, userId } = req.params;
  
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const deleted = await removeTeamMember(id, userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Member not found in team' });
    }
    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    console.error('Remove team member error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};