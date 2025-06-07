const knex = require('../db');

const createTask = async (title, description, due_date, team_id, assigned_to) => {
  return knex('tasks').insert({ 
    title, 
    description, 
    due_date, 
    team_id, 
    assigned_to 
  }).returning(['id', 'title', 'description', 'due_date', 'team_id', 'assigned_to']);
};

const getAllTasks = async () => {
  return knex('tasks')
    .select(
      'tasks.*',
      'teams.name as team_name',
      'users.email as assignee_email'
    )
    .leftJoin('teams', 'tasks.team_id', 'teams.id')
    .leftJoin('users', 'tasks.assigned_to', 'users.id');
};

const getTasksByTeam = async (team_id) => {
  return knex('tasks')
    .select(
      'tasks.*',
      'teams.name as team_name',
      'users.email as assignee_email'
    )
    .leftJoin('teams', 'tasks.team_id', 'teams.id')
    .leftJoin('users', 'tasks.assigned_to', 'users.id')
    .where('tasks.team_id', team_id);
};

const getTasksByUser = async (user_id) => {
  return knex('tasks')
    .select(
      'tasks.*',
      'teams.name as team_name',
      'users.email as assignee_email'
    )
    .leftJoin('teams', 'tasks.team_id', 'teams.id')
    .leftJoin('users', 'tasks.assigned_to', 'users.id')
    .where('tasks.assigned_to', user_id);
};

const updateTask = async (id, updates) => {
  return knex('tasks')
    .where({ id })
    .update(updates)
    .returning(['id', 'title', 'description', 'due_date', 'team_id', 'assigned_to']);
};

const deleteTask = async (id) => {
  return knex('tasks').where({ id }).del();
};

module.exports = {
  createTask,
  getAllTasks,
  getTasksByTeam,
  getTasksByUser,
  updateTask,
  deleteTask
};