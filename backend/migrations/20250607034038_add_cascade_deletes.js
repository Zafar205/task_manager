exports.up = function(knex) {
  return knex.schema.alterTable('memberships', function(table) {
    table.dropForeign('team_id');
    table.foreign('team_id').references('teams.id').onDelete('CASCADE');
  }).alterTable('tasks', function(table) {
    table.dropForeign('team_id');
    table.foreign('team_id').references('teams.id').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('memberships', function(table) {
    table.dropForeign('team_id');
    table.foreign('team_id').references('teams.id');
  }).alterTable('tasks', function(table) {
    table.dropForeign('team_id');
    table.foreign('team_id').references('teams.id');
  });
};
