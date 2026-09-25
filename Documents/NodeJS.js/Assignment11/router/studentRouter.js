const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../model/studentModel');

const router = express.Router();

// Email regex pattern for validation
const emailRegex = /^\S+@\S+\.\S+$/;

// POST /student/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, course, age } = req.body;

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

    if (!course || typeof course !== 'string' || course.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Course is required'
      });
    }

    if (age === undefined || age === null || isNaN(Number(age))) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a valid number'
      });
    }

    const numericAge = Number(age);
    if (numericAge < 5 || numericAge > 100) {
      return res.status(400).json({
        success: false,
        message: 'Age must be between 5 and 100'
      });
    }

    const formattedEmail = email.toLowerCase().trim();

    // 2. Check for duplicate email
    const existingStudent = await Student.findOne({ email: formattedEmail });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // 3. Hash password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create and save new Student document
    const student = new Student({
      name: name.trim(),
      email: formattedEmail,
      password: hashedPassword,
      course: course.trim(),
      age: numericAge
    });

    const savedStudent = await student.save();

    // 5. Return success response (excluding password)
    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        name: savedStudent.name,
        email: savedStudent.email,
        course: savedStudent.course,
        age: savedStudent.age
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
