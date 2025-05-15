const {findUserById } = require('../dal/authDal');
const { getAllUsers } = require('../dal/userDal');

const allUsers = async (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  return await getAllUsers(page,limit);
};

const getUserById = async (req) => {
    
  const id= req.params?.id ? req.params?.id : req.user?.id
 
  return await findUserById(id);
};

module.exports = {
 allUsers,
 getUserById 
};
