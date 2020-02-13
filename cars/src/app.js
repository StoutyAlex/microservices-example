const express = require('express');
const bodyParser = require('body-parser');

const Car = require('./models/cars');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'cars' });
});

app.get('/api/cars', async (req, res) => {
  const cars = await Car.find({});
  res.json(cars);
});

app.post('/api/cars', async (req, res) => {
  const car = new Car({ name: req.body.name, registration: req.body.registration });
  const savedCar = await car.save();
  res.json(savedCar);
});

module.exports = app;
