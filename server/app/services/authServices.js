const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUser } = require('../dal/authDal'); 

const createNewUser = async (req) => {
    const{email,password,username}=req
  // Check if the user already exists
  const existingUser = await findUser(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user and save to the DB
  return await createUser(username, email, hashedPassword);
};

const authenticateUser = async (email, password) => {
  const user = await findUser(email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  console.log('Stored password hash:', user.password); // For debugging

  // Check if the password is correctly hashed
  if (!user.password) {
    throw new Error('Password is not set for this user');
  }

  // Compare the input password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate a JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};


module.exports = {
  createNewUser,
  authenticateUser,
};
