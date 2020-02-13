const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/users');
const Car = require('./models/cars');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'search' });
});

app.get('/api/search', async (req, res) => {
  const userPromise = User.find({});
  const carPromise = Car.find({});
  const promises = [carPromise, userPromise];
  const [cars, users] = await Promise.all(promises);

  res.json(cars.concat(users));
});

app.get('/api/search/depends-on', async (req, res) => {
  try {
    const userPromise = fetch('http://users:3000/');
    const carPromise = fetch('http://cars:3000/');
    const [ userResponse, carResponse ] = await Promise.all([ userPromise, carPromise ]);
    const userJson = await userResponse.json();
    const carJson = await carResponse.json();

    res.json({ user: userJson, car: carJson });
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = app;
