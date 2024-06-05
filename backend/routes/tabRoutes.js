// tabsRoutes.js

const express = require('express');
const tabsRouter = express.Router();

// Route for /tabs/:username/user-data
tabsRouter.get('tabs/:username/user-data', (req, res) => {
  const username = req.params.username;
  // Fetch and return user data based on username
  res.send(`User data for ${username}`);
});

// Other routes under /tabs/:username
tabsRouter.get('/:username/:tab', (req, res) => {
  const username = req.params.username;
  const tab = req.params.tab;
  // Handle other tabs based on username and tab
  res.send(`You are viewing the ${tab} tab for ${username}`);
});

module.exports = tabsRouter;
