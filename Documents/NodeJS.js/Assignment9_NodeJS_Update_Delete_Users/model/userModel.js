const mongoose = require('mongoose');
const userSchema = require('../schema/userSchema');

// Create Mongoose Model named 'User'
const User = mongoose.model('User', userSchema);

module.exports = User;
