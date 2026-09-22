const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./router/userRouter');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = 'mongodb://127.0.0.1:27017/userdb';

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Connect to local MongoDB using Mongoose
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error(`MongoDB connection failed: ${err.message}`);
  });

// Mount the User router under /api/users endpoint
app.use('/api/users', userRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
