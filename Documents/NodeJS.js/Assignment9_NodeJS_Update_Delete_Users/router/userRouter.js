const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/userModel');

const router = express.Router();

// 1. POST /api/users - Create User
router.post('/', async (req, res) => {
  try {
    const { name, email, age, course } = req.body;

    // Create new user document in MongoDB
    const newUser = await User.create({ name, email, age, course });

    return res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
});

// 2. GET /api/users - Retrieve All Users
router.get('/', async (req, res) => {
  try {
    // Retrieve all users from MongoDB
    const users = await User.find();

    return res.status(200).json({
      users
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
});

// 3. PATCH /api/users/:id - Update User
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid user ID'
      });
    }

    // Find user and update in MongoDB using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    // Handle user not found scenario
    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
});

// 4. DELETE /api/users/:id - Delete User
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid user ID'
      });
    }

    // Find user and delete from MongoDB using findByIdAndDelete
    const deletedUser = await User.findByIdAndDelete(id);

    // Handle user not found scenario
    if (!deletedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
});

module.exports = router;
