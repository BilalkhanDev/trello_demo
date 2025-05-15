import User from '../model/userModel.js';
import bcrypt from "bcrypt"
export const createAdminUser = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });

  if (existingAdmin) {
    console.log('Admin user already exists');
     return
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = new User({
    username: 'Admin',
    email: 'admin@gmail.com',
    password: hashedPassword,
    role: 1, // Admin role
  });

  await adminUser.save();

  console.log('Admin user created successfully');
 return
};