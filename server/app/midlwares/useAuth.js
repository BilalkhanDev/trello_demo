const jwt = require('jsonwebtoken');

const useAuth = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      req.user = decoded;
      next(); // Only call next if token is valid and no response has been sent
    });
  } catch (err) {
    return res.status(500).json({ message: 'Auth middleware error', error: err.message });
  }
};
const adminOnly = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }
    next();
  };
};
const adminOrSelf = (req, res, next) => {
  const userIdFromToken = req.user?.id;
  const userRole = req.user?.role;
  const targetUserId = req.params.id; 
  console.log(userIdFromToken,userRole)
  if (userRole === 1 || userIdFromToken == targetUserId) {
    return next();
  }

  return res.status(403).json({ message: 'Access denied' });
};

module.exports = {useAuth, adminOnly,adminOrSelf};
