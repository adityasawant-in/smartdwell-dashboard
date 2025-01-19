const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true, enum: ['user', 'admin'] }
});

module.exports = mongoose.model('User', userSchema);