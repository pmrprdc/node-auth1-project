const db = require('../../data/db-config');

async function find() {
  return db('users').select('user_id', 'username');
}

async function findBy(filter) {
  return db('users').where(filter).select('user_id', 'username','password');
}

async function findById(id) {
  return db('users').where({ user_id: id }).first('user_id', 'username');
}

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
