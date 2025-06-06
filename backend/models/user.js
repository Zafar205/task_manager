const knex = require('../db');

const createUser = async (email, password_hash, is_admin = false) => {
  return knex('users').insert({ email, password_hash, is_admin }).returning(['id', 'email', 'is_admin']);
};

const findUserByEmail = async (email) => {
  return knex('users').where({ email }).first();
};

module.exports = { createUser, findUserByEmail };