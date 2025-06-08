const { validationResult } = require('express-validator');
const {
  createTask,
  getAllTasks,
  getTasksByTeam,
  getTasksByUser,
  getTasksByUserAndTeam,
  updateTask,
  deleteTask
} = require('../models/task');

exports.getTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { team_id } = req.query;
    let tasks;

    // Check if user is admin
    if (req.user.is_admin) {
      // Admin can see all tasks or filter by team
      if (team_id) {
        tasks = await getTasksByTeam(team_id);
      } else {
        tasks = await getAllTasks();
      }
    } else {
      // Regular users can only see their assigned tasks
      if (team_id) {
        // Get user's tasks for a specific team they're part of
        tasks = await getTasksByUserAndTeam(req.user.id, team_id);
      } else {
        // Get all tasks assigned to this user
        tasks = await getTasksByUser(req.user.id);
      }
    }
    
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, due_date, team_id, assigned_to } = req.body;
  
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Only admins can create tasks
    if (!req.user.is_admin) {
      return res.status(403).json({ message: 'Only admins can create tasks' });
    }

    const [task] = await createTask(title, description, due_date, team_id, assigned_to);
    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updates = req.body;
  
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Only admins can update tasks
    if (!req.user.is_admin) {
      return res.status(403).json({ message: 'Only admins can update tasks' });
    }

    const [task] = await updateTask(id, updates);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Only admins can delete tasks
    if (!req.user.is_admin) {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }

    const deleted = await deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};