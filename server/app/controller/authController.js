const { createNewUser, authenticateUser } = require('../services/authServices'); // Import service layer

// Signup Controller
const signup = async (req, res) => {
  try {
    const user = await createNewUser(req.body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signin Controller
const signin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const token = await authenticateUser(email, password);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  signin,
};
