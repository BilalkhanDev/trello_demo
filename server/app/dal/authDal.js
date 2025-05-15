const User = require('../model/userModel');

// Create a new user in the database
const createUser = async (username, email, password) => {
  const user = new User({
    username,
    role:2,
    email,
    password,

  });

  await user.save();
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;  

  return userWithoutPassword; 
};


// Find a user by username or email or Id
const findUser = async (identifier) => {
  return await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  })
};

const findUserById = async (id) => {
  return await User.findById(id).select('-password') ;
};


module.exports = {
  createUser,
  findUser,
  findUserById
};
