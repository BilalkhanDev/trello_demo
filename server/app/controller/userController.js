const { allUsers, getUserById } = require('../services/userServices');
// get All users
const users= async (req, res) => {
  try {
    const userData= await allUsers(req);
    res.status(200).json(userData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get specfivc user 
const IdenticalUser = async (req, res) => {
    if (!req.params?.id){
           res.status(400).json({ error:"Id is required" });
    }
   try {
    const userData = await getUserById(req);
    console.log(userData)
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userData);
   } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const authUser = async (req, res) => {
   try {
    const userData = await getUserById(req);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userData);
   } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
users,
IdenticalUser,
authUser
};
