const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
  name: String,
  registration: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', CarSchema);
