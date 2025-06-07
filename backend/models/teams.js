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

// Updated deleteTeam function with cascading deletes
const deleteTeam = async (id) => {
  return await knex.transaction(async (trx) => {
    // First, delete all memberships for this team
    await trx('memberships').where('team_id', id).del();
    
    // Then, delete all tasks for this team
    await trx('tasks').where('team_id', id).del();
    
    // Finally, delete the team itself
    const result = await trx('teams').where({ id }).del();
    
    return result;
  });
};

const getUserTeams = async (userId) => {
  return knex('teams')
    .select('teams.*', 'users.email as creator_email')
    .leftJoin('users', 'teams.creator_id', 'users.id')
    .leftJoin('memberships', 'teams.id', 'memberships.team_id')
    .where('memberships.user_id', userId)
    .orWhere('teams.creator_id', userId);
};

// New functions for team members
const getTeamMembers = async (teamId) => {
  return knex('memberships')
    .select('users.id', 'users.email')
    .join('users', 'memberships.user_id', 'users.id')
    .where('memberships.team_id', teamId);
};

const addTeamMembers = async (teamId, userIds) => {
  const memberships = userIds.map(userId => ({
    team_id: teamId,
    user_id: userId
  }));
  
  return knex('memberships').insert(memberships);
};

const removeTeamMember = async (teamId, userId) => {
  return knex('memberships')
    .where({ team_id: teamId, user_id: userId })
    .del();
};

module.exports = { 
  createTeam, 
  getAllTeams, 
  getTeamById, 
  updateTeam, 
  deleteTeam, 
  getUserTeams,
  getTeamMembers,
  addTeamMembers,
  removeTeamMember
};