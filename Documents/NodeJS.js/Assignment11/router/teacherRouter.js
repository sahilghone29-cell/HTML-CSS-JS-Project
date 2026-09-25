const express = require('express');
const bcrypt = require('bcrypt');
const Teacher = require('../model/teacherModel');

const router = express.Router();

// Email regex pattern for validation
const emailRegex = /^\S+@\S+\.\S+$/;

// POST /teacher/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, subject } = req.body;

    // 1. Input Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Subject is required'
      });
    }

    const formattedEmail = email.toLowerCase().trim();

    // 2. Check for duplicate email
    const existingTeacher = await Teacher.findOne({ email: formattedEmail });
    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // 3. Hash password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create and save new Teacher document
    const teacher = new Teacher({
      name: name.trim(),
      email: formattedEmail,
      password: hashedPassword,
      subject: subject.trim()
    });

    const savedTeacher = await teacher.save();

    // 5. Return success response (excluding password)
    return res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      data: {
        name: savedTeacher.name,
        email: savedTeacher.email,
        subject: savedTeacher.subject
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

module.exports = router;
