const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    age: {
      type: Number,
      required: [true, 'Age is required']
    },
    course: {
      type: String,
      required: [true, 'Course is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = userSchema;
