const AppDataSource = require('./utils/db');
const User = require('./models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();


async function createSuperadmin() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Check if a superadmin already exists
    const superadminExists = await userRepository.findOne({ where: { role: 'superadmin' } });

    if (superadminExists) {
      console.log('Superadmin already exists. You cannot create another one.');
    } else {
      // Create a new superadmin user
      const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
      const superadmin = userRepository.create({
        name: 'Super Admin',
        email: process.env.SUPER_ADMIN_EMAIL,  // For temp 
        password: hashedPassword,
        role: 'superadmin',
      });

      await userRepository.save(superadmin);
      console.log('Superadmin user created successfully.');
    }
  } catch (error) {
    console.error('Error creating superadmin:', error);
  } finally {
    // Close the database connection
    AppDataSource.destroy();
  }
}

// Initialize TypeORM and run the script
AppDataSource.initialize()
  .then(() => {
    createSuperadmin();
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
  });
