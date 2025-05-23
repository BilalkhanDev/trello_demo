const { createNewUser, authenticateUser, refreshTokensStore } = require('../services/authServices'); // Import service layer
const jwt = require('jsonwebtoken');

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
    const { accessToken, refreshToken } = await authenticateUser(email, password);
    res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }

  // Log token for debugging
  console.log("↩️ Received refresh token:", refreshToken);


  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("✅ Token verified for user:", payload?.id);

    const accessToken = jwt.sign(
      { id: payload.id, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error("❌ Token expired or invalid", err);
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};


module.exports = {
  signup,
  signin,
  refreshAccessToken

};
