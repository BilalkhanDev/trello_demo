const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUser } = require('../dal/authDal');

const createNewUser = async (req) => {
  const { email, password, username } = req
  const existingUser = await findUser(email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return await createUser(username, email, hashedPassword);
};


const refreshTokensStore = new Set(); 

const authenticateUser = async (email, password) => {
  const user = await findUser(email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};


module.exports = {
  createNewUser,
  authenticateUser,
  refreshTokensStore
};
