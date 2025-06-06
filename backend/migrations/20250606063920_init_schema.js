exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.text('password_hash').notNullable();
      table.boolean('is_admin').notNullable().defaultTo(false);
    })
    .createTable('teams', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('creator_id').references('id').inTable('users');
    })
    .createTable('memberships', (table) => {
      table.integer('user_id').references('id').inTable('users');
      table.integer('team_id').references('id').inTable('teams');
      table.primary(['user_id', 'team_id']);
    })
    .createTable('tasks', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.date('due_date');
      table.integer('team_id').references('id').inTable('teams');
      table.integer('assigned_to').references('id').inTable('users');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('tasks')
    .dropTableIfExists('memberships')
    .dropTableIfExists('teams')
    .dropTableIfExists('users');
};
