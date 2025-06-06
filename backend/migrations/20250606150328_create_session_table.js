exports.up = function(knex) {
  return knex.schema.createTable('session', (table) => {
    table.string('sid').primary();
    table.json('sess').notNullable();
    table.timestamp('expire', { precision: 6 }).notNullable();
  }).then(() => {
    return knex.raw('CREATE INDEX "IDX_session_expire" ON "session" ("expire")');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('session');
};