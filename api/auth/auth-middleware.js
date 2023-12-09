const Users = require('../users/users-model');

/**
 * Checks if the user has an active session. If not, returns a 401 status.
 */
function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
}

/**
 * Checks if the provided username in req.body already exists in the database.
 * If it does, returns a 422 status.
 */
async function checkUsernameFree(req, res, next) {
  const { username } = req.body;
  const users = await Users.findBy({ username });
  if (users.length) {
    res.status(422).json({ message: "Username taken" });
  } else {
    next();
  }
}

/**
 * Checks if the provided username in req.body exists in the database.
 * If it doesn't, returns a 401 status.
 */
async function checkUsernameExists(req, res, next) {
  const { username } = req.body;
  const users = await Users.findBy({ username });
  if (users.length) {
    req.user = users[0];
    next();
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}

/**
 * Checks if the password in req.body is missing or shorter than 4 characters.
 * If so, returns a 422 status.
 */
function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if (!password || password.length <= 3) {
    res.status(422).json({ message: "Password must be longer than 3 chars" });
  } else {
    next();
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
