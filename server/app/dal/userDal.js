const User = require('../model/userModel');

/**
 * Get paginated list of users excluding role 1
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Number of users per page
 * @returns {Object} - Contains users array, total count, total pages, current page
 */
const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  // Filter to exclude role 1
  const filter = { role: { $ne: 1 } };

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password') 
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};



module.exports = {
  getAllUsers,
};
