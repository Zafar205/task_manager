const knex = require('../db');

const createTeam = async (name, creator_id) => {
  return knex('teams').insert({ name, creator_id }).returning(['id', 'name', 'creator_id']);
};

const getAllTeams = async () => {
  return knex('teams')
    .select('teams.*', 'users.email as creator_email')
    .leftJoin('users', 'teams.creator_id', 'users.id');
};

const getTeamById = async (id) => {
  return knex('teams')
    .select('teams.*', 'users.email as creator_email')
    .leftJoin('users', 'teams.creator_id', 'users.id')
    .where('teams.id', id)
    .first();
};

const updateTeam = async (id, name) => {
  return knex('teams').where({ id }).update({ name }).returning(['id', 'name', 'creator_id']);
};

const deleteTeam = async (id) => {
  return knex('teams').where({ id }).del();
};

const getUserTeams = async (userId) => {
  return knex('teams')
    .select('teams.*', 'users.email as creator_email')
    .leftJoin('users', 'teams.creator_id', 'users.id')
    .leftJoin('memberships', 'teams.id', 'memberships.team_id')
    .where('memberships.user_id', userId)
    .orWhere('teams.creator_id', userId);
};

module.exports = { 
  createTeam, 
  getAllTeams, 
  getTeamById, 
  updateTeam, 
  deleteTeam, 
  getUserTeams 
};