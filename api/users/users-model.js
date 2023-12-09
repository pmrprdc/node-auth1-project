const db = require('../../data/db-config'); // Adjust the path according to your project structure

/**
 * Resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return db('users').select('user_id', 'username');
}

/**
 * Resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db('users').where(filter).select('user_id', 'username');
}

/**
 * Resolves to the user { user_id, username } with the given user_id
 */
function findById(id) {
  return db('users').where({ user_id: id }).first('user_id', 'username');
}

/**
 * Resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const [user_id] = await db('users').insert(user);
  return findById(user_id);
}

module.exports = {
  find,
  findBy,
  findById,
  add,
};
