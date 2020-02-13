const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/users');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'users' });
});

app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const user = new User({ username: req.body.username, password: req.body.password });
  const savedUser = await user.save();
  res.json(savedUser);
});

module.exports = app;
