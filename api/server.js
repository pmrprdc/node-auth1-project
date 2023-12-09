

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */
  const express = require("express");
  const helmet = require("helmet");
  const cors = require("cors");
  const session = require('express-session');
  const KnexSessionStore = require('connect-session-knex')(session); // Only if you're using connect-session-knex
  const knex = require('../data/db-config'); // Adjust this path to your knex configuration file
  const usersRouter = require('../api/users/users-router');
  const authRouter = require('../api/auth/auth-router');
  const server = express();
  
  // Session configuration
  const sessionConfig = {
    name: 'chocolatechip', // The name of the cookie
    secret: 'keep it secret, keep it safe!', // Used for encrypting the cookie
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Cookie valid for 1 day (in milliseconds)
      secure: false, // Should be true in a production environment using HTTPS
      httpOnly: true, // If true, the cookie is not accessible from client-side JS
    },
    resave: false, // Avoid resaving unchanged sessions
    saveUninitialized: false, // Only create a session if a user logs in
    store: new KnexSessionStore({ // If using connect-session-knex
      knex, // Pass your Knex instance
      tablename: "sessions", // Table to store sessions
      sidfieldname: "sid", // Column to store session IDs
      createtable: true, // Create the table automatically if it doesn't exist
      clearInterval: 1000 * 60 * 60, // Clear expired sessions every hour
    }),
  };
  
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  
  server.use(session(sessionConfig)); // Use the session middleware
  
  // ... rest of your server setup ...

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);
  
server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
