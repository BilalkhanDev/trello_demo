const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,  // Email must remain unique
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value); // Validator function to check if the email is valid
        },
        message: 'Please fill a valid email address', // Error message if validation fails
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: Number,
      required: true,
      enum: [1, 2], // Only allow roles 1 and 2
      default: 2,
    },
  },
  { timestamps: true }
);

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
